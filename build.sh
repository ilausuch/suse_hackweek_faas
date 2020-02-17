name="suse_hackweek_faas"

yarn
docker image rm -f $name
docker build -t $name .
