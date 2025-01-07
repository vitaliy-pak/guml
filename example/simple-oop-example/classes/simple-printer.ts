import { Printer } from "../interfaces/printer";

export class SimplePrinter implements Printer {
    print(): void {
        console.log("Printing...");
    }
}