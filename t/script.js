


$(function(){


    $('.file').filepond();
    $('.file').filepond('allowMultiple', false);
    $('.file').filepond(
        {
            server: {
                process: (fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
                    // fieldName is the name of the input field
                    // file is the actual file object to send
                    console.log(file.name)
                    console.log(file)
                    const formData = new FormData();
                    formData.append('file', file, file.name);
        
                    const request = new XMLHttpRequest();
                    request.withCredentials = false
                    request.open('POST', 'https://crisp-promptly-mastodon.ngrok-free.app/https://0x0.st' );
                    request.setRequestHeader('ngrok-skip-browser-warning', 'sex')
                    request.send(formData); 
        
                    // Should call the progress method to update the progress to 100% before calling load
                    // Setting computable to false switches the loading indicator to infinite mode
                    request.upload.onprogress = (e) => {
                        progress(e.lengthComputable, e.loaded, e.total);
                    };
        
                    // Should call the load method when done and pass the returned server file id
                    // this server file id is then used later on when reverting or restoring a file
                    // so your server knows which file to return without exposing that info to the client
                    request.onload = function () {
                        // var element = document.getElementsByClassName("filepond--action-revert-item-processing");
                        // element.classList.remove("filepond--action-revert-item-processing");
                        if (request.status >= 200 && request.status < 300) {
                            // the load method accepts either a string (id) or an object
                            console.log(request.responseText)
                            load(request.responseText);
                            sex(request.responseText)
                        } else {
                            // Can call the error method if something is wrong, should exit after
                            error('oh no');
                        }
                    };
        
                    
        
                    // Should expose an abort method so the request can be cancelled
                    return {
                        abort: () => {
                            // This function is entered if the user has tapped the cancel button
                            request.abort();
        
                            // Let FilePond know the request has been cancelled
                            abort();
                        },
                    };
                },
            }
        }
    );

  });

async function sex(text) {
    const e = document.getElementById("textA")
    document.getElementById("textA").value = text
    e.style.height = 'auto';
    // Set the height according to the scroll height
    e.style.height = e.scrollHeight + 'px';

}


function copy() {
    var text = document.getElementById('textA');
    text.select();
    document.execCommand('copy');
}