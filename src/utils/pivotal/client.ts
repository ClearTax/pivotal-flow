import Axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import serialize, { SerializeJSOptions } from 'serialize-javascript';
import ora = require('ora');

import {
  PivotalProfile,
  PivotalStory,
  PivotalStoryResponse,
  GetStoriesResponse,
  PivotalProjectResponse,
} from './types';
import { error as logError, warning as logWarning } from '../console';

export interface PivotalClientOptions {
  debug?: boolean;
  apiToken: string;
  projectId: string;
}

/**
 * An http-client-ish class acting as an interface to the Pivotal REST APIs.
 */
export default class PivotalClient {
  private restClient: AxiosInstance;
  private API_TOKEN: string;
  private PROJECT_ID: string;
  private SERIALIZE_ERROR_OPTIONS: SerializeJSOptions = {
    space: 2,
  };
  private debug: boolean;

  constructor(options: PivotalClientOptions) {
    this.API_TOKEN = options.apiToken;
    this.PROJECT_ID = options.projectId;
    this.debug = options.debug || false;

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

  /**
   * Logs the error (with help-text, if any) based on debug/no-debug mode.
   * Logs response JSON when debug mode is true.
   */
  logErrorMessage(axiosError: AxiosError) {
    const { response, request } = axiosError;
    if (response) {
      // non-2xx response
      const { status, data, statusText } = response;
      const { possible_fix: helpText } = data || {};

      if (helpText === 'string') {
        // when pivotal provides a 'possible_fix' for their error code
        logWarning(helpText);
      }
      this.debug && logError(`Error - ${serialize({ status, data, statusText }, this.SERIALIZE_ERROR_OPTIONS)}`);
    } else if (request) {
      // network error
      logWarning(`NetworkError: Please check your internet connection & try again.`);
      this.debug && logError(`${serialize(request, this.SERIALIZE_ERROR_OPTIONS)})}`);
    } else {
      // Something happened in setting up the request that triggered an Error
      logWarning(`An unknown error occurred. Use the --debug option to get more details.`);
      this.debug && logError(`Unknown Error - ${axiosError.message}`);
    }
  }

  /**
   * Run an axios, with some common wrappers:
   *  - log error messages, with help if applicable
   *  - add a spinner to indicate progress
   */
  async request<ResponseType>(
    /** Axios config is transparently passed `to axios.request()` */
    config: AxiosRequestConfig,
    /** Labels for the spinner. */
    spinnerConfig:
      | false
      | {
          /**
           * Text to display alongside the spinner: while the request is in progress
           * @example 'Creating story'
           */
          progress: string;
          /**
           * Text to display alongside the spinner: while the request succeeds
           * @example 'Story created successfully'
           */
          success?: string;
          /**
           * Text to display alongside the spinner: if there's an error in the request.
           * @example 'Story creation failed'
           */
          error?: string;
        }
  ) {
    const spinner = spinnerConfig && this.getSpinner(spinnerConfig.progress);
    const { success: onSuccess, error: onError } = spinnerConfig || {};
    try {
      spinner && spinner.start();
      const { data } = await this.restClient.request<ResponseType>(config);
      spinner && spinner.succeed(onSuccess);
      return data;
    } catch (errorResponse) {
      spinner && spinner.fail(onError);
      this.logErrorMessage(errorResponse);
      throw new Error('Failed to fetch/update details from/to Pivotal.');
    }
  }

  /**
   * Get the details about the current user
   */
  async getProfile() {
    return this.request<PivotalProfile>(
      {
        method: 'GET',
        url: '/me',
      },
      {
        progress: 'Fetching your profile',
        success: 'Profile information received',
        error: 'Error fetching profile',
      }
    );
  }

  /**
   * Fetch stories based on project and pivotal query
   * @param {string} query - pivotal search query-string
   */
  async getStories(query: string) {
    return this.request<GetStoriesResponse>(
      {
        method: 'GET',
        url: `/projects/${this.PROJECT_ID}/search?query=${query}`,
      },
      { progress: 'Fetching stories' }
    );
  }

  /**
   * Fetch a project details for a specified projectId
   */
  async getProject() {
    return this.request<PivotalProjectResponse>(
      {
        method: 'GET',
        url: `/projects/${this.PROJECT_ID}`,
      },
      { progress: `Fetching project details` }
    );
  }

  /**
   * Get a single story's details.
   * @param id {number} Story id
   */
  async getStory(id: number) {
    return this.request<PivotalStoryResponse>(
      {
        method: 'GET',
        url: `/projects/${this.PROJECT_ID}/stories/${id}`,
      },
      { progress: `Fetching story [${id}]` }
    );
  }

  /**
   * Create a story in the current project.
   * @param {PivotalStory} story
   */
  async createStory(story: PivotalStory) {
    return this.request<PivotalStoryResponse>(
      {
        method: 'POST',
        url: `/projects/${this.PROJECT_ID}/stories`,
        data: story,
      },
      { progress: 'Creating story', success: 'Story created successfully', error: 'Failed to create a story' }
    );
  }

  /**
   * Update a single story's details.
   * @param id {number} story id
   * @param story {PivotalStory} story details to be updated
   */
  async updateStory(id: number, story: Partial<PivotalStory>) {
    return this.request<PivotalStoryResponse>(
      {
        method: 'PUT',
        url: `/projects/${this.PROJECT_ID}/stories/${id}`,
        data: story,
      },
      false
    );
  }
}
