# README

* This folder is intend for websocket mock.

* Each file should export object like:

```[es]
export default {
    subscribe: {
      '/path/to/subscribe' : (data, stompServer) => {
        // processing function.
        stompServer.set(path, header, content);
      },
    },

    receive: {
      '/path/received': (data, stompServer) => {
        // similar to subscribe.
      }
    }
}
```
