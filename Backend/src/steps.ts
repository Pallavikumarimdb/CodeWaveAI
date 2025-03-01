import xml2js from "xml2js";

/**
 * Parses an XML string into a JavaScript object representing the steps.
 * @param xmlString - The XML content to parse.
 * @returns An array of parsed step objects.
 */
export function parseXml(xmlString: string): any[] {
    const parser = new xml2js.Parser({ explicitArray: false });
    let steps: any[] = [];

    //@ts-ignore
    parser.parseString(xmlString, (err, result) => {
        if (err) {
            console.error("Error parsing XML:", err);
            return;
        }
        
        if (result && result.steps && result.steps.step) {
            steps = Array.isArray(result.steps.step) ? result.steps.step : [result.steps.step];
        }
    });
    
    return steps;
}
