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


    const compose_recipients = document.getElementById('compose-recipients');
    const compose_subject = document.getElementById('compose-subject');
    const compose_body = document.getElementById('compose-body');
    document.querySelector('[type="submit"]').addEventListener('click', (event) => {
        // To prevent the default form submission
        event.preventDefault();

        fetch('emails', {
            method: 'POST',
            body: JSON.stringify({
                recipients: compose_recipients.value,
                subject: compose_subject.value,
                body: compose_body.value,
            })
          })
          .then(response => response.json())
          .then(result => {
              // Print result
              console.log(result);
              load_mailbox('sent');
          });
    })
}

function load_mailbox(mailbox) {
    // Show the mailbox and hide other views
    document.querySelector('#emails-view').style.display = 'block';
    document.querySelector("#email-list").style.display = 'none';
    document.querySelector('#compose-view').style.display = 'none';

    // Show the mailbox name
    document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
    
    // Get all emails
    fetch(`emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {
        console.log(emails);
        display_main(emails, mailbox);
        
    });
    
}

// Show all email lists
function display_main(emails, mailbox) {
    const email_list = document.getElementById("emails-view");

    emails.forEach(email => {
        const email_div_fa = document.createElement("div");
        email_div_fa.className = "relative w-75 mx-auto";

        const email_div = document.createElement("div");
        email_div_fa.appendChild(email_div);
        email_div.className = "w-5/6 border mb-3 p-3 cursor-pointer"
        if ( mailbox === "inbox" && email.read) {
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

        // 创建表格行
        const table = document.createElement('table');
        table.className = 'table-auto w-full';
        const email_row = document.createElement('tr');
        table.appendChild(email_row);

        // 创建 sender 单元格并靠左对齐
        const email_sender_cell = document.createElement('td');
        email_sender_cell.textContent = email.sender;
        email_sender_cell.className = 'text-left text-lg font-semibold';
        email_row.appendChild(email_sender_cell);

        // 创建 subject 单元格并靠左对齐
        const email_subject_cell = document.createElement('td');
        email_subject_cell.textContent = email.subject;
        email_subject_cell.className = 'text-left';
        email_row.appendChild(email_subject_cell);

        // 创建 time 单元格并靠右对齐
        const email_time_cell = document.createElement('td');
        email_time_cell.textContent = email.timestamp;
        email_time_cell.className = 'text-right';
        email_time_cell.colSpan = 2; // 占两列
        email_row.appendChild(email_time_cell);

        // 将表格行添加到表格中
        email_div.appendChild(table);


        if (mailbox === "inbox") {
            const archive_btn = document.createElement("button");
            archive_btn.className = "absolute right-0 inset-y-0 btn btn-sm btn-outline-primary h-2/3";
            archive_btn.innerText = "Archive";
            archive_btn.addEventListener("click", () => {
                console.log("click");
                fetch(`emails/${email.id}`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        archived: true
                    })
                })
                load_mailbox("inbox");
            })

            email_div_fa.appendChild(archive_btn);
        } else if (mailbox === "archive") {
            const archive_btn = document.createElement("button");
            archive_btn.className = "absolute right-0 inset-y-0 btn btn-sm btn-outline-primary h-2/3";
            archive_btn.innerText = "Unarchive";
            archive_btn.addEventListener("click", () => {
                console.log("click");
                fetch(`emails/${email.id}`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        archived: false
                    })
                })
                load_mailbox("inbox");
            })

            email_div_fa.appendChild(archive_btn);
        }
       
        email_list.appendChild(email_div_fa);
    });
}

// Show the content of current email
function show_email(email) {
    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector("#email-list").style.display = 'block';

    document.getElementById("from").innerText = email.sender;
    document.getElementById("to").innerText = email.recipients;
    document.getElementById("subject").innerText = email.subject;
    document.getElementById("timestamp").innerText = email.timestamp;
    document.getElementById("content").innerText = email.body;
}
