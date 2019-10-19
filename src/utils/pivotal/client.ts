import Axios, { AxiosInstance, AxiosError } from 'axios';
import serialize, { SerializeJSOptions } from 'serialize-javascript';

import { PivotalClientOptions, PivotalProfile, PivotalStory, PivotalStoryResponse } from './types';
import { error as logError } from '../console';

export default class PivotalClient {
  private restClient: AxiosInstance;
  private API_TOKEN: string;
  private PROJECT_ID: string;
  private SERIALIZE_ERROR_OPTIONS: SerializeJSOptions = {
    space: 2,
  };

  constructor(options: PivotalClientOptions) {
    this.API_TOKEN = options.API_TOKEN;
    this.PROJECT_ID = options.PROJECT_ID;

    this.restClient = Axios.create({
      baseURL: 'https://www.pivotaltracker.com/services/v5',
      timeout: 10000, // search could be really slow, keeping a 10 second timeout.
      headers: { 'X-TrackerToken': this.API_TOKEN },
    });
  }

  logErrorMessage(axiosError: AxiosError, operation: string) {
    const { response, request } = axiosError;
    if (response) {
      // non-2xx response
      const { status, data, statusText } = response;
      logError(`${operation}: Error - ${serialize({ status, data, statusText }, this.SERIALIZE_ERROR_OPTIONS)}`);
    } else if (request) {
      // network error
      logError(`${operation}: NetworkError - ${serialize(request, this.SERIALIZE_ERROR_OPTIONS)})}`);
    } else {
      // Something happened in setting up the request that triggered an Error
      logError(`${operation}: Unknown Error - ${axiosError.message}`);
    }
  }

  /**
   * Get the details about the current user
   */
  async getProfile() {
    try {
      const { data } = await this.restClient.get<PivotalProfile>('/me');
      return data;
    } catch (errorResponse) {
      this.logErrorMessage(errorResponse, 'fetching your profile');
      throw errorResponse;
    }
  }

  /**
   * Create a story in the current project.
   * @param {PivotalStory} story
   */
  async createStory(story: PivotalStory) {
    try {
      const { data } = await this.restClient.post<PivotalStoryResponse>(`/projects/${this.PROJECT_ID}/stories`, story);
      return data;
    } catch (errorResponse) {
      this.logErrorMessage(errorResponse, 'creating story');
      throw errorResponse;
    }
  }
}

// (async () => {
//   // test it out
//   const client = new PivotalClient({
//     API_TOKEN: process.env.PIVOTAL_TOKEN as string,
//     PROJECT_ID: process.env.PIVOTAL_PROJECT_ID as string,
//   });
//   console.log(
//     await client.createStory({
//       name: `Test Story (${Date.now()})`,
//       story_type: StoryType.Chore,
//       // estimate: 0,
//       labels: [{ name: 'test-pivotal-flow' }],
//     })
//   );
// })();
