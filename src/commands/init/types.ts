/**
 * Project configuration
 */
export interface ProjectConfiguration {
  name: string;
  id: number;
}

/**
 * The configuration object required by pivotal-flow
 */
export interface Configuration {
  projects: ProjectConfiguration[];
  pivotalApiToken: string;
}

/**
 * Similar to CosmiconfigResult but with our config as type
 */
export interface ConfigResult {
  config: Configuration;
  isEmpty?: boolean;
  filepath: string;
}
