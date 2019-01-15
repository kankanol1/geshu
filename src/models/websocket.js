import SockJS from 'sockjs-client';
import Stomp from 'stompjs-websocket';
import { message } from 'antd';

const enabledUrls = ['/demo', '/projects/p/pipeline/**'];

const matchUrl = (url, urls) => {
  const exactMatch = () => urls.filter(i => i === url).length > 0;
  const fuzzyMatch = () =>
    urls
      .filter(i => i.endsWith('**'))
      .map(i => i.substr(0, i.length - 2))
      .filter(i => url.startsWith(i)).length > 0;
  const result = exactMatch() || fuzzyMatch();
  return result;
};

const websocketRegister = {
  // url => receiver mapping.
  '/user/datapro/recipes': 'demo/onWSReceived',
};

let connectingTip;

let socket;
let stompClient;

export default {
  namespace: 'ws',

  state: {
    waitingRequests: [],
    waitingSubscribes: [],
    ws: undefined,
  },

  reducers: {
    send(state, { payload }) {
      if (!state.ws) {
        // put to waiting list.
        return { ...state, waitingRequests: [...state.waitingRequests, payload] };
      }
      const { topic, header, body } = payload;
      state.ws.send(topic, header, body);
      return state;
    },

    subscribe(state, { payload }) {
      if (!state.ws) {
        // /
        return { ...state, waitingSubscribes: [...state.waitingSubscribes, payload] };
      }
      const { topic, callback } = payload;
      state.ws.subscribe(topic, callback);
      return state;
    },

    unsubscribe(state, { payload }) {
      if (state.ws) {
        const { topic } = payload;
        state.ws.subscribe(topic, {});
      }
      return state;
    },

    saveWS(state, { payload }) {
      return { ...state, ws: payload };
    },

    clearCache(state) {
      return { ...state, waitingRequests: [] };
    },
  },

  effects: {
    *sendCached({ payload }, { select, put }) {
      const { ws, waitingRequests, waitingSubscribes } = yield select(state => state.ws);
      waitingSubscribes.forEach(i => {
        ws.subscribe(i.topic, i.callback);
        console.log('subscribe', i.topic); // eslint-disable-line
      });
      waitingRequests.forEach(i => {
        ws.send(i.topic, i.header, i.body);
      });
      yield put({
        type: 'clearCache',
      });
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      // let lastPathname;
      history.listen(({ pathname }) => {
        if (connectingTip) {
          connectingTip();
        }
        if (matchUrl(pathname, enabledUrls) && !socket) {
          socket = new SockJS('/ws');
          stompClient = Stomp.over(socket);
          // set timout to prevent warning: "triggering nested component updates from render is not allowed."
          setTimeout(() => {
            connectingTip = message.loading('与服务器连接中...', 0);
          }, 0);
          const connectedCallback = frame => {
            // check url.
            if (!matchUrl(history.location.pathname, enabledUrls)) {
              // disconnect.
              stompClient.disconnect(() => {
                console.log('connected, but url changed. disconnect finished, closing socket'); // eslint-disable-line
                socket.close();
                socket = undefined;
                stompClient = undefined;
              });
              // end of story.
              connectingTip(); // disable connection
              return;
            }
            Object.keys(websocketRegister).forEach(k =>
              stompClient.subscribe(k, msg => {
                dispatch({
                  type: websocketRegister[k],
                  payload: msg,
                });
              })
            );

            // store ws.
            dispatch({
              type: 'saveWS',
              payload: stompClient,
            });

            // send blocked msg.
            dispatch({
              type: 'sendCached',
            });
            connectingTip();
          };
          const connect = () => {
            stompClient.connect(
              {},
              frame => connectedCallback(frame),
              error => {
                // reconnect.
                connect();
              }
            );
          };
          connect();
        } else if (socket && !matchUrl(pathname, enabledUrls)) {
          // if (socket.readyState === SockJS.CONNECTING) {
          //   // close after established.
          // }
          if (stompClient.connected) {
            stompClient.disconnect(() => {
              console.log('disconnect finished, closing socket'); // eslint-disable-line
              socket.close();
              socket = undefined;
              stompClient = undefined;
            });
          } else {
            // TODO: set delay or what ever.
            // eslint-disable-next-line
            console.warn(
              'stomp client is not initialized, the connection may be established latter.'
            );
          }
        }
      });
    },
  },
};
