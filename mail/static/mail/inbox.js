document.addEventListener('DOMContentLoaded', function() {

    // Use buttons to toggle between views
    document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
    document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
    document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
    document.querySelector('#compose').addEventListener('click', compose_email);

    // By default, load the inbox
    load_mailbox('inbox');
});

function compose_email() {

    // Show compose view and hide other views
    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'block';

    // Clear out composition fields
    const recipients = document.querySelector('#compose-recipients');
    const subject = document.querySelector('#compose-subject');
    const body = document.querySelector('#compose-body');

    recipients.value = '';
    subject.value = '';
    body.value = '';

    document.querySelector('form').onsubmit = () => {
        fetch('/emails', {
            method: 'POST',
            body: JSON.stringify({
                recipients: recipients.value,
                subject: subject.value,
                body: body.value
                })
            })
        .then(response => response.json())
        .then(result => {
            // Print result
            console.log(result);
        });
        load_mailbox('sent');

        return false;
    }

}

function load_mailbox(mailbox) {
    // Show the mailbox name
    document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
    // Show the mailbox and hide other views
    document.querySelector('#emails-view').style.display = 'block';
    document.querySelector('#compose-view').style.display = 'none';
    // Fetch the emails
    fetch(`/emails/${mailbox}`, {
        method: 'GET'})
    .then(response => response.json())
    .then(emails => {
        emails.forEach(load_emails);
        // Print result to console
        console.log(emails);
    });
}

function load_emails(emails) {
    console.log(emails);
    // Create new email element
    const email = document.createElement('div');
    const link - document.createElement('a');
    // If read , white , then not read , blue borders
    if emails.read {
        email.className = 'border border-white';
    } else {
        email.className = 'border border-primary';
    }

    link.href = `/emails/${emails.id}`
    email.innerHTML = `${emails.sender}: ${emails.subject} at ${emails.timestamp}`;
    // Append to the div
    document.querySelector('#emails-view').append(email);
}
