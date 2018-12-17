import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
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
          connectingTip = message.loading('与服务器连接中...', 0);
          const connectedCallback = frame => {
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
              connectedCallback,
              error => {
                // reconnect.
                connect();
              }
            );
          };
          connect();
        } else if (socket && !matchUrl(pathname, enabledUrls)) {
          stompClient.disconnect(() => {
            console.log('disconnect finished, closing socket'); // eslint-disable-line
            socket.close();
            socket = undefined;
          });
        }
      });
    },
  },
};
