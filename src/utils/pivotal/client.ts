import Axios, { AxiosInstance, AxiosError } from 'axios';
import serialize, { SerializeJSOptions } from 'serialize-javascript';
import ora = require('ora');

import { isSetupComplete } from '../../commands/init/utils';
import { PivotalProfile, PivotalStory, PivotalStoryResponse, GetStoriesResponse } from './types';
import { error as logError } from '../console';
export default class PivotalClient {
  private restClient: AxiosInstance;
  private API_TOKEN: string;
  private PROJECT_ID: string;
  private SERIALIZE_ERROR_OPTIONS: SerializeJSOptions = {
    space: 2,
  };

  constructor() {
    if (!isSetupComplete()) {
      throw new Error('Setup incomplete');
    }

    this.API_TOKEN = process.env.PIVOTAL_TOKEN as string;
    this.PROJECT_ID = process.env.PIVOTAL_PROJECT_ID as string;

    this.restClient = Axios.create({
      baseURL: 'https://www.pivotaltracker.com/services/v5',
      timeout: 10000, // search could be really slow, keeping a 10 second timeout.
      headers: { 'X-TrackerToken': this.API_TOKEN },
    });
  }

  getSpinner(label: string) {
    return ora({
      color: 'cyan',
      text: label,
    });
  }

  logErrorMessage(axiosError: AxiosError) {
    const { response, request } = axiosError;
    if (response) {
      // non-2xx response
      const { status, data, statusText } = response;
      logError(`Error - ${serialize({ status, data, statusText }, this.SERIALIZE_ERROR_OPTIONS)}`);
    } else if (request) {
      // network error
      logError(`NetworkError - ${serialize(request, this.SERIALIZE_ERROR_OPTIONS)})}`);
    } else {
      // Something happened in setting up the request that triggered an Error
      logError(`Unknown Error - ${axiosError.message}`);
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
      this.logErrorMessage(errorResponse);
      throw errorResponse;
    }
  }

  /**
   * Fetch stories based on project and pivotal query
   * @param {string} query - pivotal search query-string
   */
  async getStories(query: string) {
    try {
      const { data } = await this.restClient.get<GetStoriesResponse>(
        `/projects/${this.PROJECT_ID}/search?query=${query}`
      );
      return data;
    } catch (errorResponse) {
      this.logErrorMessage(errorResponse);
      throw errorResponse;
    }
  }

  /**
   * Get a single story's details.
   * @param id {number} Story id
   */
  async getStory(id: number) {
    try {
      const { data } = await this.restClient.get<PivotalStoryResponse>(`/projects/${this.PROJECT_ID}/stories/${id}`);
      return data;
    } catch (errorResponse) {
      this.logErrorMessage(errorResponse);
      throw errorResponse;
    }
  }

  /**
   * Create a story in the current project.
   * @param {PivotalStory} story
   */
  async createStory(story: PivotalStory) {
    const label = 'Creating story';
    const spinner = this.getSpinner(label);

    try {
      spinner.start();
      const { data } = await this.restClient.post<PivotalStoryResponse>(`/projects/${this.PROJECT_ID}/stories`, story);
      spinner.succeed('Story created successfully');
      return data;
    } catch (errorResponse) {
      spinner.fail('Failed to create a story.');
      this.logErrorMessage(errorResponse);
      throw errorResponse;
    }
  }

  /**
   * Update a single story's details.
   * @param id {number} story id
   * @param story {PivotalStory} story details to be updated
   */
  async updateStory(id: number, story: Partial<PivotalStory>) {
    try {
      const { data } = await this.restClient.put<PivotalStoryResponse>(
        `/projects/${this.PROJECT_ID}/stories/${id}`,
        story
      );
      return data;
    } catch (errorResponse) {
      this.logErrorMessage(errorResponse);
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
//   console.log(serialize(await client.getStories(`mywork:"${2714693}" AND state:unstarted,planned`), { space: 2 }));
// })();
