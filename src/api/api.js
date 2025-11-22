import githubService from '../service/githubService';
import service from '../service/service';

const fileReview = async (file) => {
    const res = await service.post('/upload-and-process', file);
    return res;
}

const getRepoBranches = async (repoName) => {
    const res = await githubService.get(`/repos/${repoName}/branches`);
    return res;
};

const getRepoCommits = async (repoName, name) => {
    const res = await githubService.get(`/repos/${repoName}/commits?sha=${name}`);
    return res;
};

const getRepoComments = async (repoName) => {
    const res = await githubService.get(`/repos/${repoName}/comments`);
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

export { fileReview,
    getRepoCommits, getCommitDetails, getRepoBranches, getRepoComments };