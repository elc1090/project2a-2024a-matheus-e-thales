function requestCommits(username, repoName, page = 1, perPage = 10) {
    return fetch(`https://api.github.com/repos/${username}/${repoName}/commits?page=${page}&per_page=${perPage}`);
}

function displayCommits(username, repoName, page = 1) {
    const commitsContainer = document.getElementById('commitsContainer');
    commitsContainer.innerHTML = '';

    requestCommits(username, repoName, page)
        .then(response => response.json())
        .then(commits => {
            commits.forEach(commit => {
                const commitItem = document.createElement('div');
                commitItem.classList.add('commit-item');
                commitItem.innerHTML = `
                    <p><strong>SHA:</strong> ${commit.sha}</p>
                    <p><strong>Author:</strong> ${commit.commit.author.name}</p>
                    <p><strong>Date:</strong> ${commit.commit.author.date}</p>
                    <p><strong>Message:</strong> ${commit.commit.message}</p>
                    <hr>
                `;
                commitsContainer.appendChild(commitItem);
            });

            displayPagination(username, repoName, page);
        })
        .catch(error => {
            console.error('Error fetching commits:', error);
            commitsContainer.innerHTML = `<p>Error fetching commits. Please try again.</p>`;
        });
}

function displayPagination(username, repoName, currentPage) {
    const paginationContainer = document.getElementById('paginationContainer');
    paginationContainer.innerHTML = '';

    const prevButton = document.createElement('button');
    prevButton.innerText = 'Previous Page';
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            displayCommits(username, repoName, currentPage - 1);
        }
    });
    paginationContainer.appendChild(prevButton);

    const nextButton = document.createElement('button');
    nextButton.innerText = 'Next Page';
    nextButton.addEventListener('click', () => {
        displayCommits(username, repoName, currentPage + 1);
    });
    paginationContainer.appendChild(nextButton);
}

const gitHubForm = document.getElementById('gitHubForm');
gitHubForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const usernameInput = document.getElementById('usernameInput');
    const repoInput = document.getElementById('repoInput');
    const gitHubUsername = usernameInput.value;
    const repoName = repoInput.value;

    displayCommits(gitHubUsername, repoName);
});
