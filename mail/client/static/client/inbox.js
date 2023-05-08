document.addEventListener('DOMContentLoaded', function () {

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
    document.querySelector("#email-list").style.display = 'none';
    document.querySelector('#compose-view').style.display = 'block';

    // Clear out composition fields
    document.querySelector('#compose-recipients').value = '';
    document.querySelector('#compose-subject').value = '';
    document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {

    // Show the mailbox and hide other views
    document.querySelector('#emails-view').style.display = 'block';
    document.querySelector("#email-list").style.display = 'none';
    document.querySelector('#compose-view').style.display = 'none';

    // Show the mailbox name
    document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
    if (mailbox === "inbox") {
        show_inbox();
    }
}

function show_inbox() {

    // Get all emails
    fetch("emails/inbox")
        .then(response => response.json())
        .then(emails => {
            display_main(emails);
        });
}

// Show all email lists
function display_main(emails) {
    const email_list = document.getElementById("emails-view");

    emails.forEach(email => {
        const email_div = document.createElement("div");
        email_div.className = "w-75 mx-auto flex flex-row border mb-3 p-3 cursor-pointer"
        if (email.read) {
            email_div.classList.add("bg-gray-100");
        }

        email_div.addEventListener("click", () => {
            // Get the conetnt of current email
            fetch(`emails/${email.id}`)
            .then(response => response.json())
            .then(email => {
                show_email(email);
            })
            
            fetch(`emails/${email.id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    read: true
                })
            })
            
        });

        const email_sender = document.createElement("div");
        email_sender.textContent = email.sender;
        email_sender.className = "basis-1/4 text-lg font-semibold";
        email_div.appendChild(email_sender);

        const email_subject = document.createElement("div");
        email_subject.textContent = email.subject;
        email_subject.className = "basis-1/4";
        email_div.appendChild(email_subject);

        const email_time = document.createElement("div");
        email_time.textContent = email.timestamp;
        email_time.className = "basis-1/2 text-right";
        email_div.appendChild(email_time);

        email_list.appendChild(email_div);
    });
}

// Show the content of current email
function show_email(email) {
    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector("#email-list").style.display = 'block';

    document.getElementById("from").append(email.recipients[0]);
    document.getElementById("to").append(email.sender);
    document.getElementById("subject").append(email.subject);
    document.getElementById("timestamp").append(email.timestamp);
    document.getElementById("content").append(email.body);
}
