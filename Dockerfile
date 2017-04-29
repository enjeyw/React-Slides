FROM debian

RUN apt-get update \
&& apt-get install -y \
    uwsgi \
    uwsgi-plugin-python3 \
    unoconv \
    imagemagick \
    python3-pip \
&& apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN apt-get update && apt-get -y install libffi-dev libssl-dev


# Add and install Python modules
ADD requirements.txt /src/requirements.txt
RUN cd /src; pip3 install -r requirements.txt

ADD ./ /
RUN chmod +x /deploy.sh

# Bundle app source
ADD . /src

# Expose
EXPOSE  5000

# Run
CMD ["/deploy.sh"]