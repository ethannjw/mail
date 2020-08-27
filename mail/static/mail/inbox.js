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
    const div = document.createElement('div');
    const link = document.createElement('a');
    const sender = document.createElement('span');
    const subject = document.createElement('span');
    const timestamp = document.createElement('span');
    // If read , light grey , then not read , white borders
    if (emails.read) {
        div.className = 'bg-light border rounded';
    } else {
        div.className = 'bg-white border rounded';
    }

    link.href = `javascript:load_email(${emails.id})`;

    // Create the sender object
    sender.innerHTML = `${emails.sender}`;
    sender.className = "align-top font-weight-bold text-left";
    sender.id = "sender";
    sender.style = "float:left;padding-left: 15px;"

    // Create the subject
    subject.innerHTML = `Subject: ${emails.subject}`;
    subject.className = "align-top text-center";
    subject.id = "subject";
    subject.style = "padding-left: 30px;"

    // Create the timestamp
    timestamp.innerHTML = `${emails.timestamp}`;
    timestamp.className = "align-top font-italic text-right text-muted";
    timestamp.id = "timestamp";
    timestamp.style = "float:right"

    //append to the a tag
    link.append(sender);
    link.append(subject);


    // append to the div
    div.append(link);
    div.append(timestamp);
    // Append to the div
    document.querySelector('#emails-view').append(div);
}

function load_email(id) {
    // Show the mailbox and hide other views
    document.querySelector('#emails-view').innerHTML = '';
    document.querySelector('#emails-view').style.display = 'block';
    document.querySelector('#compose-view').style.display = 'none';
    // Fetch the email
    fetch(`/emails/${id}`, {
        method: 'GET'})
    .then(response => response.json())
    .then(email => {
        // Print result to console
        console.log(email);
        const from = document.createElement('div');
        const to = document.createElement('div');
        const subject = document.createElement('div');
        const timestamp = document.createElement('div');
        const reply = document.createElement('button');
        const archive = document.createElement('button');
        const body = document.createElement('div');

        // from object
        from.innerHTML = `<b>From: </b>${email.sender}`;
        document.querySelector('#emails-view').append(from);

        // to object
        to.innerHTML = `<b>To: </b>${email.recipients}`;
        document.querySelector('#emails-view').append(to);

        // subject object
        subject.innerHTML = `<b>Subject: </b>${email.subject}`;
        document.querySelector('#emails-view').append(subject);

        // timestamp object
        timestamp.innerHTML = `<b>Time Sent: </b>${email.timestamp}`;
        document.querySelector('#emails-view').append(timestamp);

        // reply button
        reply.innerHTML = "Reply"
        reply.className = "btn btn-sm btn-outline-primary";
        reply.id = "reply"
        document.querySelector('#emails-view').append(reply);

        // archive button
        archive.innerHTML = "Archive"
        archive.className = "btn btn-sm btn-outline-primary";
        archive.id = "archive"
        archive.onclick = archive_email(id);
        document.querySelector('#emails-view').append(archive);

        // create a divider line
        document.querySelector('#emails-view').append(document.createElement('hr'));

        // body
        body.innerHTML = `<p>${email.body}</p>`;
        document.querySelector('#emails-view').append(body);
    });
    // Mark the email read
    fetch(`/emails/${id}`, {
        method: 'PUT',
        body: JSON.stringify({read: true})
        })
    .then(response => response.status)
    .then(read => {
        console.log(`Read status: ${read}`);
    });
}

function archive_email(id) {
    // Mark the email archived
    fetch(`/emails/${id}`, {
        method: 'PUT',
        body: JSON.stringify({archived: true})
        })
    .then(response => response.status)
    .then(read => {
        console.log(`Archived status: ${read}`);
    });
    load_mailbox('inbox');
}
