export default {
  subscribe: {},
  receive: {
    '/app/datapro/pipeline/update': (request, server) => {
      // eslint-disable-next-line
      console.log('pipeline updated');
    },
  },
};
