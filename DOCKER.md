## Get running

    docker pull docker-registry.media.mit.edu/mongodb
    docker pull docker-registry.media.mit.edu/pubpub
    docker run -d -p 27017:27017 -p 28017:28017 --name pubpub_mongodb --hostname=pubpub_mongodb docker-registry.media.mit.edu/mongodb
    docker run -d -p 3030:3030 -p 8080:8080 --name pubpub --link=pubpub_mongodb --hostname=pubpub \
      -e NODE_ENV="$NODE_ENV" -e FIREBASESECRET="$FIREBASESECRET" -e MONGOURI="$MONGOURI" -e PORT="$PORT" \
      -e SENDGRIDAPIKEY="$SENDGRIDAPIKEY" -e ACCESSKEYAWS="$ACCESSKEYAWS" -e SECRETKEYAWS="$SECRETKEYAWS" \
      docker-registry.media.mit.edu/pubpub

In the above case, pubpub should appear on port 8080 (PORT=8080). If you want to have it appear on port 80, not only do you need to adjust the PORT environment variable, you need to adjust the `-p 8080:8080` port assignment to `80:80`

Or, if you have copied api/config.sample.js to api/config.js and edited it, then you can start the container with:

    docker run -d -p 3030:3030 -p 8080:8080 --name pubpub --link=pubpub_mongodb --hostname=pubpub \
      docker-registry.media.mit.edu/pubpub

Again this will direct port 8080 to port 8080 in the container, adjust that to match your configuration

### Docker Image

First, you should copy `api/config.sample.js` to `api/config.js`. You can either then load the environment variables as the same above with `-e ...` or you can adjust `api/config.js` and hardcode that information in the appropriate places.

Then build the image:

    docker build pubpub .

Now you should have a `pubpub` local image and you should be able to use it using the same commands above, e.g.

    docker run -d -p 3030:3030 -p 8080:8080 --name pubpub --link=pubpub_mongodb --hostname=pubpub pubpub
