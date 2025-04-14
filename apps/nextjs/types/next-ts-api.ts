import { ExtractNextBody, ExtractNextParams, ExtractNextResponse } from 'next-ts-api';
import { GET as GET_1 } from '../app/api/hello/route';
import { PUT as PUT_2, DELETE as DELETE_2 } from '../app/api/test-api/route';
import { GET as GET_3, POST as POST_3, PUT as PUT_3, DELETE as DELETE_3 } from '../app/api/todo/route';

export type ApiRoutes = {
  'hello': {
    GET: {
      response: ExtractNextResponse<typeof GET_1>
      params: ExtractNextParams<typeof GET_1>
    },
  };
  'test-api': {
    PUT: {
      body: ExtractNextBody<typeof PUT_2>
      response: ExtractNextResponse<typeof PUT_2>
      params: ExtractNextParams<typeof PUT_2>
    },
    DELETE: {
      response: ExtractNextResponse<typeof DELETE_2>
      params: ExtractNextParams<typeof DELETE_2>
    },
  };
  'todo': {
    GET: {
      response: ExtractNextResponse<typeof GET_3>
      params: ExtractNextParams<typeof GET_3>
    },
    POST: {
      body: ExtractNextBody<typeof POST_3>
      response: ExtractNextResponse<typeof POST_3>
      params: ExtractNextParams<typeof POST_3>
    },
    PUT: {
      body: ExtractNextBody<typeof PUT_3>
      response: ExtractNextResponse<typeof PUT_3>
      params: ExtractNextParams<typeof PUT_3>
    },
    DELETE: {
      response: ExtractNextResponse<typeof DELETE_3>
      params: ExtractNextParams<typeof DELETE_3>
    },
  };
};
