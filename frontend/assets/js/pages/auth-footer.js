// Add floating animation to books
        document.addEventListener('DOMContentLoaded', function() {
            const books = document.querySelectorAll('.book');
            books.forEach((book, index) => {
                book.style.animationDelay = `${index * 0.5}s`;
            });
        });
