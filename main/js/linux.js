"use strict";

var dummy;

dummy = {};

dummy.group = {
    gid: 100,
    name: 'user'
};

dummy.user = {
    uid: 100,
    name: 'user',
    group: dummy.group,
    shell: "/bin/bash",
    home: "/home/user"
};