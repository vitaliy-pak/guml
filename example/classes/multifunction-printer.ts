import { Printer } from "../interfaces/printer";
import { Scanner } from "../interfaces/scanner";

export class MultiFunctionPrinter implements Printer, Scanner {
    print(): void {
        console.log("Printing...");
    }

    scan(): void {
        console.log("Scanning...");
    }
}