import { NextApiHandler } from "next";

interface Holiday {
    summary: string
    description: string
}

interface HolidayData {
    [key: string]: Holiday
}

// Define the holidays database
let holidaysData: HolidayData;

// Define the holidays database URL
// TODO: Dynamic year and country
const holidaysUrl = 'https://raw.githubusercontent.com/frasnym/holidays-scraper/main/public/id.indonesian/2024.json';

// Function to fetch holidays data
async function fetchHolidaysData() {
    try {
        const response = await fetch(holidaysUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch holidays data: ${response.status} ${response.statusText}`);
        }
        holidaysData = await response.json();
    } catch (e) {
        if (typeof e === "string") {
            console.error('Error fetching holidays data:', e.toUpperCase());
        } else if (e instanceof Error) {
            console.error('Error fetching holidays data:', e.message);
        }
    }
}

// Function to check if a date is a holiday
function isHoliday(dateStr: string) {
    return dateStr in holidaysData;
}

// Function to calculate the result date based on input date and working days
async function calculateResultDate(inputDateStr: string, workingDays: number) {
    if (holidaysData === undefined) {
        await fetchHolidaysData()
    }
    // TODO: Check data if available

    const inputDate = new Date(inputDateStr);
    let currentDate = new Date(inputDate);

    let daysCount = 0;
    while (daysCount < workingDays) {
        // Increment the current date by one day
        currentDate.setDate(currentDate.getDate() + 1);

        // Check if the current date is a weekend (Saturday or Sunday)
        if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
            // Check if the current date is not a holiday
            if (!isHoliday(currentDate.toISOString().split('T')[0])) {
                daysCount++;
            }
        }
    }

    // Convert the result date to a string in the same format
    const resultDateStr = currentDate.toISOString().split('T')[0];
    return resultDateStr;
}


const handler: NextApiHandler = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { inputDateStr, workingDays } = req.body;
    if (inputDateStr === undefined) {
        return res.status(400).json({ error: "inputDateStr required" })
    }
    if (workingDays === undefined) {
        return res.status(400).json({ error: "workingDays required" })
    }
    // TODO: Validate input type; inputDateStr: date YYYY-MM-DD format; workingDays: number

    try {
        const resultDate = await calculateResultDate(inputDateStr, workingDays);
        res.status(200).json({ resultDate });
    } catch (e) {
        if (typeof e === "string") {
            console.error('Error calculating result date:', e.toUpperCase());
        } else if (e instanceof Error) {
            console.error('Error calculating result date:', e.message);
        }

        res.status(500).json({ error: 'Internal server error' });
    }
}

export default handler