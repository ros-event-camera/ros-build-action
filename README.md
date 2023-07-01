# ros-build-action action

This action is used to compile ROS packages.
The repository also contains reusable workflows for building
ROS / ROS2 packages.


## Inputs

### `repo`

**Required** The name of the repository to build.

### `ros_distro`

**Required** The name of the ROS distro to build for (noetic, humble, ...).

## Outputs

### `status`

The status of the job (currently will only return ``success``)

## Example usage

```yaml
uses: ros-event-camera/ros-build-action@master
  with:
    repo: my_repo_name
    ros_distro: galactic
```
