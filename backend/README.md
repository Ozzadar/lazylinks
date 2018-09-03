# LazyLinks Backend

Simple API server written in Golang to support short url creation

To run locally:

```bash
cd lazylinks/backend
go get .
go run main.go
```

## Configuration

A Configuration file can be found in `backend/config/app.conf`

You'll need to edit this file to point at your rethinkdb instance. If you're running rethinkdb through docker... I believe the default is saved to the copy-pasted `sudo docker run` command that can be found on `docker hub`

You can also change the address and port bindings for your API should the default be conflicting with another server running on your box.

## Note

There's a `logging` package I use in here that I didn't really feel like changing out. It saves most DB and API messages out to a `server.log` file on runtime. 

I use it sporatically through the codebase and probably should have taken it out or ALWAYS used it. Either way, you'll get most of your logs in there... and some in the console... 

Sorry about that ;)