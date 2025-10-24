import githubService from '../service/githubService';

const getRepoCommits = async (repoName) => {
    const res = await githubService.get(`/repos/${repoName}/commits`);
    return res;
};

const getCommitDetails = async (repoName, sha) => {
    const res = await githubService.get(`/repos/${repoName}/commits/${sha}`, {
        headers: {
            'Accept': 'application/vnd.github.v3.diff; charset=utf-8',
        },
    });
    return res;
}

export { getRepoCommits, getCommitDetails };