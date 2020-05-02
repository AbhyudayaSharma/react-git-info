declare module "react-git-info/macro" {
  export interface GitCommitInformation {
    readonly date: string;
    readonly hash: string;
    readonly message: string;
    readonly shortHash: string;
  }

  export interface GitInformation {
    readonly tags: string[];
    readonly branch: string;
    readonly commit: GitCommitInformation;
  }

  export default function GitInfo(): GitInformation;
}
