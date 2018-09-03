# LazyLinks UI

Basic React application created using `create-react-app` with all said generators included `npm` functions.

To run locally:

```bash
cd lazylinks/ui
npm i
npm start
```

## SETUP

You'll need to point this application to the correct LazyLinks backend server. If you haven't customized your endpoint from the defaults set in the backend, nothing needs to be done (if running locally)

If for some reason you were being fancy (i.e. for some misguided reason you tried to run this in production), then change

`API_BASE_URL` in `ui/common/consts.js` to your server location. 

I could probably take time out to create a proper configuration file or something but.... meh, I did it with the backend so that's enough.