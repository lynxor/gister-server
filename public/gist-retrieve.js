var target, spinner;

$(function () {
    target = document.getElementById('loading');
    spinner = new Spinner(spinner_opts);
});


function retrieveGistMeta() {
    var gistId = ( $("#gist_id").val() ).trim();

    if (!gistId || gistId.trim() === "") {
        alert("Please provide a gist id");
        return;
    }
    spinner.spin(target);
    var url = 'https://api.github.com/gists/' + gistId;

    $.ajax({
        url:url,
        crossDomain : true,
        type: "GET",
        dataType: "json",
        success:function (data, textStatus, jqXHR) {
            if (data) {
                //for now, just the first file
                var file = data.files[ _(data.files).keys()[0] ],
                    matches = file.filename.match(/(.*)\..*/),
                    cmd = matches.length > 1 ? matches[1] : file;
                $("#url").val(file.raw_url);
                $("#description").val(data.description);
                $("#title").val(data.description);
                $("#tags").val(file.language);
                $("#author").val(data.user.login);
                $("#html_url").val(data.html_url);
                $("#command").val( cmd );
                $("#message").html("Success!");
                $("#message").css({color: "green"});
            } else {
                $("#message").html("Invalid data returned");
                $("#message").css({color: "red"});
            }
            spinner.stop();
        },
        error:function (jqXHR, textStatus, errorThrown) {
            $("#message").html("Failed with status : " + textStatus + "</br> " + errorThrown);
            $("#message").css({color: "red"});
            spinner.stop();
        }
    });
}

