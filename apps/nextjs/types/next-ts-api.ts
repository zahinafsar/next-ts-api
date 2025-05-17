import type { ExtractNextBody, ExtractNextQuery, ExtractNextResponse, ExtractNextParams } from 'next-ts-api';
import type { GET as GET_1, POST as POST_1 } from '../app/api/hello/route';
import type { POST as POST_2, GET as GET_2 } from '../app/api/todo/[id]/create/[type]/route';
import type { POST as POST_3, GET as GET_3 } from '../app/api/todo/[id]/create/route';
import type { GET as GET_4, POST as POST_4 } from '../app/api/todo/[id]/route';
import type { GET as GET_5, POST as POST_5, PUT as PUT_5, DELETE as DELETE_5 } from '../app/api/todo/route';

export type ApiRoutes = {
  'hello': {
    GET: {
      response: ExtractNextResponse<typeof GET_1>
      query: ExtractNextQuery<typeof GET_1>
      params: ExtractNextParams<typeof GET_1>
    },
    POST: {
      body: ExtractNextBody<typeof POST_1>
      response: ExtractNextResponse<typeof POST_1>
      query: ExtractNextQuery<typeof POST_1>
      params: ExtractNextParams<typeof POST_1>
    },
  };
  'todo/[id]/create/[type]': {
    POST: {
      body: ExtractNextBody<typeof POST_2>
      response: ExtractNextResponse<typeof POST_2>
      query: ExtractNextQuery<typeof POST_2>
      params: ExtractNextParams<typeof POST_2>
    },
    GET: {
      response: ExtractNextResponse<typeof GET_2>
      query: ExtractNextQuery<typeof GET_2>
      params: ExtractNextParams<typeof GET_2>
    },
  };
  'todo/[id]/create': {
    POST: {
      body: ExtractNextBody<typeof POST_3>
      response: ExtractNextResponse<typeof POST_3>
      query: ExtractNextQuery<typeof POST_3>
      params: ExtractNextParams<typeof POST_3>
    },
    GET: {
      response: ExtractNextResponse<typeof GET_3>
      query: ExtractNextQuery<typeof GET_3>
      params: ExtractNextParams<typeof GET_3>
    },
  };
  'todo/[id]': {
    GET: {
      response: ExtractNextResponse<typeof GET_4>
      query: ExtractNextQuery<typeof GET_4>
      params: ExtractNextParams<typeof GET_4>
    },
    POST: {
      body: ExtractNextBody<typeof POST_4>
      response: ExtractNextResponse<typeof POST_4>
      query: ExtractNextQuery<typeof POST_4>
      params: ExtractNextParams<typeof POST_4>
    },
  };
  'todo': {
    GET: {
      response: ExtractNextResponse<typeof GET_5>
      query: ExtractNextQuery<typeof GET_5>
      params: ExtractNextParams<typeof GET_5>
    },
    POST: {
      body: ExtractNextBody<typeof POST_5>
      response: ExtractNextResponse<typeof POST_5>
      query: ExtractNextQuery<typeof POST_5>
      params: ExtractNextParams<typeof POST_5>
    },
    PUT: {
      body: ExtractNextBody<typeof PUT_5>
      response: ExtractNextResponse<typeof PUT_5>
      query: ExtractNextQuery<typeof PUT_5>
      params: ExtractNextParams<typeof PUT_5>
    },
    DELETE: {
      response: ExtractNextResponse<typeof DELETE_5>
      query: ExtractNextQuery<typeof DELETE_5>
      params: ExtractNextParams<typeof DELETE_5>
    },
  };
};
