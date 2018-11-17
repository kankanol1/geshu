import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

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
    setup({ dispatch }) {
      // console.log('setting up');
      // const socket = new SockJS('/ws');
      // const stompClient = Stomp.over(socket);
      // stompClient.connect(
      //   {},
      //   frame => {
      //     console.log('connected');

      //     stompClient.subscribe('/topic/greetings', message => {
      //       console.log('onmessage', message);
      //     });
      //     console.log('subscribe');
      //     stompClient.send('/app/hello', {}, JSON.stringify({ name: 'sb.' }));
      //   }
      // );

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
    },
  },
};
