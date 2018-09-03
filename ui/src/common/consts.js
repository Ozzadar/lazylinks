export const CONST = {
    // Used to validate the urls put into the input field.
    // Right now, we validate everything without whitespace because a reliable 
    // URL validation Regex string is hard to find/create
    // and I couldn't be bothered at the moment
    URL_VALIDATION_REGEX: '^[\\S]*$',
    API_BASE_URL: 'http://192.168.0.13:4000/'
}