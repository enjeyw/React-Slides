FROM debian:stretch

RUN apt-get update \
&& apt-get install -y \
    uwsgi \
    uwsgi-plugin-python3 \
    fontconfig \
    wget \
    unzip

RUN mkdir ~/.fonts && cd ~/.fonts && wget https://github.com/google/fonts/archive/master.zip && unzip master.zip
RUN fc-cache -fv

RUN apt-get update \
&& apt-get install -y \
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

#RUN apt-get install -y software-properties-common
#RUN add-apt-repository ppa:libreoffice/ppa
#RUN apt-get update

# Expose
EXPOSE  5000

# Run
CMD ["/deploy.sh"]