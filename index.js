//
// Copyright 2023 Bernd Pfrommer <bernd.pfrommer@gmail.com>
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const core = require('@actions/core');
const github = require('@actions/github');

try {
  const repo = core.getInput('repo');
  const ros_distro = core.getInput('ros_distro');
  console.log(`compiling ${repo} for ros distro ${ros_distro}!`);

  const execSync = require('child_process').execSync;

  // run vcs to import missing repositories

  execSync(`. /opt/ros/${ros_distro}/setup.sh && cd src && if [ -f ${repo}/${repo}.repos ]; then vcs import <${repo}/${repo}.repos ; fi`, {stdio: 'inherit'});

  // build and test

  if (['noetic', 'kinetic', 'melodic'].includes(`${ros_distro}`)) {
    // ROS1
    execSync(`. /opt/ros/${ros_distro}/setup.sh && catkin config -DCMAKE_BUILD_TYPE=RelWithDebInfo && catkin build --no-status`, {stdio: 'inherit'})
  } else {
    // ROS2 and later
    execSync(`. /opt/ros/${ros_distro}/setup.sh && colcon build --event-handlers status- --symlink-install --cmake-args -DCMAKE_BUILD_TYPE=RelWithDebInfo && colcon test && colcon test-result --verbose`, {stdio: 'inherit'})
  }
  
  core.setOutput("status", "success");
} catch (error) {
  core.setFailed(error.message);
}
