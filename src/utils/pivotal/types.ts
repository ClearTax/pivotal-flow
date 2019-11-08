export enum StoryType {
  Feature = 'feature',
  Bug = 'bug',
  Chore = 'chore',
  Release = 'release',
}

export const enum StoryState {
  Accepted = 'accepted',
  Delivered = 'delivered',
  Finished = 'finished',
  Planned = 'planned',
  Rejected = 'rejected',
  Started = 'started',
  Unscheduled = 'unscheduled',
  Unstarted = 'unstarted',
}

/**
 * Pivotal Project Information
 */
export interface PivotalProject {
  id: number;
  project_id: number;
  project_name: string;
  project_color: string;
}

export interface PivotalProjectResponse {
  kind: 'project';
  name: string;

  automatic_planning: boolean;
  bugs_and_chores_are_estimatable: boolean;
  created_at: string;

  // eg: '0,1,2,3'
  point_scale: string;
  point_scale_is_custom: boolean;

  current_iteration_number: number;
  description?: string;
  enable_tasks: boolean;
  id: number;
  initial_velocity: number;
  iteration_length: number;
  project_type: 'private' | 'public';
  public: boolean;
  start_date: string;
  start_time: string;
  updated_at: string;
  velocity_averaged_over: number;
  version: number;
  week_start_day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
}

/**
 * Pivotal Project Information associated with a user.
 */
export interface UserPivotalProject extends PivotalProject {
  favorite: boolean;
  role: 'member' | 'owner';
  last_viewed_at: string;
}

/**
 * Provides information about the user.
 */
export interface PivotalProfile {
  id: number;
  email: string;
  name: string;
  username: string;
  initials: string;
  projects: PivotalProject[];
  created_at: string;
  updated_at: string;
  receives_in_app_notifications: boolean;
  has_google_identity: boolean;
}

export interface Label {
  name: string;
}

export interface LabelResponse extends Label {
  kind: 'label';
  readonly counts?: number;
  readonly id: number;
  readonly project_id: number;

  readonly created_at: string;
  readonly updated_at: string;
}

export interface PivotalStory {
  /**
   * Title/name of the story.
   */
  name: string;
  /**
   * Type of story
   */
  story_type: StoryType;
  /**
   * In-depth explanation of the story requirements.
   */
  description?: string;
  /**
   * Point value of the story.
   */
  estimate?: number;
  /**
   * Story labels.
   */
  labels: Label[] | string[];
  owner_ids: number[];
  current_state?: StoryState;
}

export interface PivotalStoryResponse extends PivotalStory {
  kind: 'story';
  readonly id: number;
  readonly labels: LabelResponse[];
  readonly project_id: number;
  readonly url: string;

  readonly created_at: string;
  readonly updated_at: string;
}

export interface GetStoriesResponse {
  stories: {
    stories: PivotalStoryResponse[];
    total_points: number;
    total_points_completed: number;
    total_hits: number;
    total_hits_with_done: number;
  };
  epics: {
    epics: any[];
  };
  query: string;
}

export const PointScales = {
  linear: [0, 1, 2, 3],
  fibonacci: [0, 1, 2, 3, 5, 8],
  powers_of_two: [0, 1, 2, 4, 8],
};
