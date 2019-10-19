export const enum StoryType {
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

export interface PivotalClientOptions {
  API_TOKEN: string;
  PROJECT_ID: string;
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
  labels: Label[];
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
