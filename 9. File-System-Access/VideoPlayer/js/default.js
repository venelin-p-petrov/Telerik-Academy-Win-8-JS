(function () {
    "use strict";

    WinJS.Binding.optimizeBindingReferences = true;

    var app = WinJS.Application;
    var appData = Windows.Storage.ApplicationData.current;
    var storagePermissions = Windows.Storage.AccessCache.StorageApplicationPermissions;

    var permissionTokens = appData.localSettings.values["permissionTokens"];
    if (permissionTokens) {
        permissionTokens = JSON.parse(permissionTokens);
    }
    else {
        permissionTokens = [];
        appData.localSettings.values["permissionTokens"] = JSON.stringify(permissionTokens);
    }

    app.onactivated = function (args) {
        args.setPromise(WinJS.UI.processAll());

        var videoListElement = document.getElementById("video-list");
        var player = document.getElementById("player");

        var addVideoBtn = WinJS.Utilities.id("add-video");
        var removeVideo = WinJS.Utilities.id("remove-video");
        var savePlaylist = WinJS.Utilities.id("save-playlist");
        var loadPlaylist = WinJS.Utilities.id("load-playlist");

        addVideoBtn.listen("click", function (event) {
            var openPicker = new Windows.Storage.Pickers.FileOpenPicker();

            openPicker.fileTypeFilter.append(".mp4");
            openPicker.pickMultipleFilesAsync().then(function (files) {
                files.forEach(addVideo);
            });
        });

        removeVideo.listen("click", function () {
            WinJS.Utilities.query("#video-list .selected").forEach(function (element) {
                if (element.classList.contains("current-video")) {
                    element.classList.remove("current-video");
                    player.pause();
                    player.attributes.removeNamedItem("src");
                }

                permissionTokens = permissionTokens.filter(function (el) { return el != element.getAttribute("data-video-token") });
                appData.localSettings.values["permissionTokens"] = JSON.stringify(permissionTokens);
                element.removeNode(true);
            });
        });

        savePlaylist.listen("click", function () {
            var savePicker = new Windows.Storage.Pickers.FileSavePicker();
            savePicker.defaultFileExtension = ".plst";
            savePicker.fileTypeChoices.insert("Playlist", [".plst"])
            savePicker.suggestedFileName = "New Playlist";

            savePicker.pickSaveFileAsync().then(function (file) {
                var videos = new Array();
                WinJS.Utilities.query("#video-list li").forEach(function (el) {
                    videos.push(el.getAttribute("data-video-token"));
                });
                var textToWrite = JSON.stringify(videos);
                Windows.Storage.FileIO.writeTextAsync(file, textToWrite);
            });
        });

        loadPlaylist.listen("click", function () {
            var openPicker = new Windows.Storage.Pickers.FileOpenPicker();
            openPicker.fileTypeFilter.append(".plst");
            openPicker.pickSingleFileAsync().then(function (file) {
                Windows.Storage.FileIO.readTextAsync(file).then(function (text) {
                    var videos = JSON.parse(text);

                    for (var i = 0; i < videos.length; i++) {
                        storagePermissions.futureAccessList.getFileAsync(videos[i]).then(addVideo);
                    }
                });
            });
        });

        videoListElement.addEventListener("click", function (event) {
            if (!event.ctrlKey) {
                var videoEntry = event.target;

                if (videoEntry.tagName.toLowerCase() == "div") {
                    videoEntry = videoEntry.parentElement;
                }

                if (videoEntry.tagName.toLowerCase() == "li") {
                    WinJS.Utilities.query("#video-list .current-video").removeClass("current-video");

                    videoEntry.classList.add("current-video");
                    player.src = videoEntry.getAttribute("data-video-url");
                    player.play();
                }
            }
            else {
                var item = event.target;

                if (item.tagName.toLowerCase() == "div") {
                    item = item.parentElement;
                }

                if (item.classList.contains("selected")) {
                    item.classList.remove("selected");
                } else {
                    item.classList.add("selected");
                }
            }
        });

        player.addEventListener("ended", function () {
            var curr = WinJS.Utilities.query("#video-list .current-video");
            var next = curr[0].nextElementSibling;
            curr.removeClass("current-video");

            if (next) {
                next.classList.add("current-video");
                player.src = next.getAttribute("data-video-url");
                player.play();
            } else {
                player.pause();
                player.attributes.removeNamedItem("src");
            }
        });

        var addVideo = function (storageFile) {
            var fileUrl = URL.createObjectURL(storageFile);

            var token = storageFile.name + Date.now();
            storagePermissions.futureAccessList.addOrReplace(token, storageFile);
            permissionTokens.push(token);
            appData.localSettings.values["permissionTokens"] = JSON.stringify(permissionTokens);

            storageFile.properties.getVideoPropertiesAsync().then(function (properties) {
                addVideoListEntry(properties.title ? properties.title : storageFile.displayName, properties.duration, fileUrl, token);
            });
        };

        var addVideoListEntry = function (title, duration, url, token) {
            var time = convertTime(duration);
            var videoEntry = document.createElement("li");
            videoEntry.setAttribute("data-video-url", url);
            videoEntry.setAttribute("data-video-token", token);
            videoEntry.innerHTML = '<div class="video-title">' + title + '</div><div class="video-duration">' + time + '<div>';
            videoListElement.appendChild(videoEntry);
        };

        var convertTime = function (miliseconds) {
            var hours = Math.floor(miliseconds / (1000 * 60 * 60));
            miliseconds -= hours * 1000 * 60 * 60;
            var minutes = Math.floor(miliseconds / (1000 * 60));
            miliseconds -= minutes * 1000 * 60;
            var seconds = Math.floor(miliseconds / 1000);

            return hours + ":" + ("0" + minutes).slice(-2) + ":" + ("0" + seconds).slice(-2);
        }
    };

    app.start();
})();
