/**
 * A Babel plugin macro giving access to git information at compile time.
 */
declare module "react-git-info/macro" {
  /**
   * Information about a git commit.
   */
  export interface GitCommitInformation {
    /**
     * Date of the commit as a string in strict ISO 8601 format.
     */
    readonly date: string;
    /**
     * Full hash of the latest commit on the active branch.
     */
    readonly hash: string;
    /**
     * Raw commit message.
     */
    readonly message: string;
    /**
     * Abbreviated commit hash with length defined as `core.abbrev` in
     * {@link https://git-scm.com/docs/git-config | git-config}.
     */
    readonly shortHash: string;
  }

  export interface GitInformation {
    /**
     * Tags pointing to the current commit.
     */
    readonly tags: string[];
    /**
     * The current git branch. `undefined` if the repository is in a detached HEAD state.
     */
    readonly branch?: string;
    /**
     * Information about the commit pointed to by `HEAD`.
     */
    readonly commit: GitCommitInformation;
  }

  export interface GitVersion {
    /**
     * Most recent tag from the current commit.
     */
    readonly tag: string;
    /**
     * Number of additional commits since the most recent tag.
     */
    readonly distance: number;
    /**
     * Abbreviated commit hash.
     */
    readonly shortHash: string;
    /**
     * True if the working tree has local modifications.
     */
    readonly isDirty: boolean;
  }

  /**
   * Returns information about the current Git state.
   */
  export default function GitInfo(): GitInformation;

  /**
   * Returns information about the current Git version.
   */
  export function GitVersion(): GitVersion;
}
