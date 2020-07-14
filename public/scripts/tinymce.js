window.addEventListener('load', function () {
    tinymce.init({
        selector: 'textarea#tiny-mce-post-body',
        height: 300,
        plugins: [
            'a11ychecker advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker',
            'searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking',
            'table emoticons template paste help'
        ],
        toolbar: 'undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | ' +
            'bullist numlist outdent indent | link image | print preview media fullpage | ' +
            'forecolor backcolor emoticons | help',
        automatic_uploads: true,
        relative_urls: false,
        images_upload_url: '/uploads/postImage',
        images_upload_handler: function (blobInfo, success, failure) {

            let headers = new Headers();
            headers.append('Accept', 'Application/JSON')

            let formData = new FormData();
            formData.append('post-image', blobInfo.blob(), blobInfo.filename());

            let req = new Request('/uploads/postImage', {
                method: "POST",
                headers,
                mode: 'cors',
                body: formData
            })

            fetch(req)
                .then(res => res.json())
                .then(data => success(data.imageUrl))
                .catch(() => failure('Http Error'))
        }
    });
})