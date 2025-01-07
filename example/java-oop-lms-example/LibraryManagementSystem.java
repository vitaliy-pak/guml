public class LibraryManagementSystem {
    public static void main(String[] args) {
        Library library = new Library();

        // Adding books
        library.addBook(new Book("1984", "George Orwell", "123456789"));
        library.addBook(new Book("To Kill a Mockingbird", "Harper Lee", "987654321"));

        // Adding members
        library.addMember(new Member("Alice", "M001"));
        library.addMember(new Member("Bob", "M002"));

        // Displaying books and members
        library.displayBooks();
        library.displayMembers();

        // Borrowing and returning books
        library.borrowBook("123456789", "M001");
        library.returnBook("123456789");
        library.borrowBook("987654321", "M002");
    }
}