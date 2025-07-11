const manageUsersButton = document.getElementById('manage-users');
const manageSubdomainsButton = document.getElementById('manage-subdomains');
const usersTable = document.querySelector('.users-table');
const subdomainsTable = document.querySelector('.subdomains-table');
const noTableMessage = document.querySelector('#no-table-selected');
manageUsersButton.addEventListener('click', () => {
    usersTable.style.display = 'table';
    subdomainsTable.style.display = 'none';
    noTableMessage.style.display = 'none';
});
manageSubdomainsButton.addEventListener('click', () => {
    usersTable.style.display = 'none';
    subdomainsTable.style.display = 'table';
    noTableMessage.style.display = 'none';
});