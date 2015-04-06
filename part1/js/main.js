var library = (function () {

    function getBooks() {
        var books = localStorage.getItem('books');
        try {
            books = books ? JSON.parse(books) : [];
        } catch (e) {
            books = [];
        }
        return books;
    }

    function addBook() {
        var form = {};
        $('form').serializeArray().map(function (item) {
            form[item.name] = item.value;
        });
        var books = getBooks();
        if (form.id) {
            books[form.id] = form;
        } else {
            books.push(form);
        }
        localStorage.setItem('books', JSON.stringify(books));
        $('form input').val('');
        library.updateList();
    }

    function removeBook() {
        var id = $(this).parent().parent().data('book');
        var books = getBooks();
        books.splice(id, 1);
        localStorage.setItem('books', JSON.stringify(books));
        library.updateList();
    }

    function editBook() {
        var id = $(this).parent().parent().data('book');
        var books = getBooks();
        var book = books[id];
        for (var i in book) {
            if (book.hasOwnProperty(i)) {
                var fieldValue = book[i];
                $('input[name="' + i + '"]').val(fieldValue);
            }
        }
        $('input[name="id"]').val(id);
    }

    return {
        init: function () {
            $('.add').on('click', addBook);
            this.updateList();
        },
        updateList: function () {
            var books = getBooks();
            var html = '';
            for (var i = 0; i < books.length; i++) {
                var book = books[i];
                html += '<tr data-book="' + i + '">' +
                    '<td>' + book['author'] + '</td><td>' + book['name-book'] + '</td>' +
                    '<td><button type="button" class="btn btn-default edit">edit</button>' +
                    '<button type="button" class="btn btn-default remove">remove</button></td>' +
                    '</tr>';
            }
            $('.list tbody').html(html);
            $('.edit').on('click', editBook);
            $('.remove').on('click', removeBook);
        }
    };

})();

library.init();