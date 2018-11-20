import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

const enabledUrls = ['/demo'];

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

let socket;
let stompClient;

export default {
  namespace: 'ws',

  state: {
    waitingRequests: [],
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

    saveWS(state, { payload }) {
      return { ...state, ws: payload };
    },

    clearCache(state) {
      return { ...state, waitingRequests: undefined };
    },
  },

  effects: {
    *sendCached({ payload }, { select, put }) {
      const { ws, waitingRequests } = yield select(state => state.ws);
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
        if (matchUrl(pathname, enabledUrls) && !socket) {
          socket = new SockJS('/ws');
          stompClient = Stomp.over(socket);
          stompClient.connect(
            {},
            frame => {
              Object.keys(websocketRegister).forEach(k =>
                stompClient.subscribe(k, message => {
                  dispatch({
                    type: websocketRegister[k],
                    payload: message,
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
            }
          );
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
