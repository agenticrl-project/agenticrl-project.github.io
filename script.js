const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
themeToggle?.addEventListener('click', () => {
  const isDark = root.getAttribute('data-theme') === 'dark';
  root.setAttribute('data-theme', isDark ? 'light' : 'dark');
  themeToggle.textContent = isDark ? '☾' : '☀';
});

document.querySelectorAll('.timeline-step').forEach((step) => {
  step.addEventListener('click', () => {
    document.querySelectorAll('.timeline-step').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.info-panel').forEach(p => p.classList.remove('active'));
    step.classList.add('active');
    document.getElementById(step.dataset.panel)?.classList.add('active');
  });
});

// const scenarioData = {
//   trajectory: {
//     title: 'Trajectory Following', ssr: '93%', rsr: '90%', s2r: '97%',
//     text: 'Follow a target trajectory while minimizing deviation and maintaining stable UAV motion.',
//     bullets: ['Primary objective: path progress and low deviation.', 'Failure condition: large path deviation or collision.', 'Best for showing reward shaping over trajectories.']
//   },
//   gate: {
//     title: 'Gate Traversal', ssr: '100%', rsr: '100%', s2r: '100%',
//     text: 'Traverse a gate while maintaining centered, collision-free motion.',
//     bullets: ['Primary objective: pass through the gate center.', 'Reward emphasizes progress and alignment.', 'Useful for showing scene-conditioned reward design.']
//   },
//   obstacle: {
//     title: 'Obstacle Avoidance & Landing', ssr: '96%', rsr: '82%', s2r: '85%',
//     text: 'Avoid cylindrical obstacles and land on the target pad.',
//     bullets: ['Primary objective: safe navigation and landing.', 'Failure condition: obstacle collision or failed landing.', 'Tests whether the reward balances safety and goal completion.']
//   },
//   barrier: {
//     title: 'Wall Barrier Crossing & Landing', ssr: '95%', rsr: '85%', s2r: '89%',
//     text: 'Cross a wall-like barrier and perform controlled landing on the target pad.',
//     bullets: ['Primary objective: barrier crossing and landing.', 'Requires altitude-aware reward shaping.', 'Tests complex 3D navigation behavior.']
//   },
//   circular: {
//     title: 'Circular Motion Generation', ssr: '98%', rsr: '98%', s2r: '100%',
//     text: 'Generate smooth circular motion with stable UAV control.',
//     bullets: ['Primary objective: stable orbit-like motion.', 'Failure condition: unstable or incomplete motion.', 'Highlights behavior generation rather than point-to-point navigation.']
//   }
// };

<script>
const scenarioData = {
  trajectory: {
    title: "Trajectory Following",
    text: "Follow a target trajectory while minimizing deviation and maintaining stable UAV motion.",
    bullets: [
      "Primary objective: path progress and low deviation.",
      "Failure condition: large path deviation or collision.",
      "Best for showing reward shaping over trajectories."
    ],
    ssr: "93%",
    rsr: "90%",
    s2r: "97%",
    plot: "assets/traj_follow.png",
    plotAlt: "Trajectory following real-world plot",
    plotCaption: "Real-world trajectory-following rollout colored by velocity magnitude.",
    gif: "videos/traj_reward.gif",
    gifAlt: "Trajectory following reward evolution",
    gifCaption: "Reward evolves from local attraction toward trajectory-aligned progress.",
    taskMediaType: "image",
    taskMediaSrc: "assets/task_input_trajectory.jpg",
    taskMediaAlt: "Trajectory following task input image",
    taskMediaCaption: "Scene image used as visual context for reward generation.",
    userPrompt: `"""
Generate a Python reward function for an RL agent whose goal is to smoothly follow a trajectory
defined by five ordered future waypoints.

Assume the simulator provides:
- obs : np.array
        Shape (27,) for single drone:
            - obs[0:3] is the drone position [x, y, z]
            - obs[3:6] is the drone orientation [roll, pitch, yaw]
            - obs[6:9] is the drone linear velocity [vx, vy, vz]
            - obs[9:12] is the drone angular velocity [wx, wy, wz]
            - obs[12:15] is the first relative trajectory point [p1_x - drone_x, p1_y - drone_y, p1_z - drone_z]
            - obs[15:18] is the second relative trajectory point [p2_x - drone_x, p2_y - drone_y, p2_z - drone_z]
            - obs[18:21] is the third relative trajectory point [p3_x - drone_x, p3_y - drone_y, p3_z - drone_z]
            - obs[21:24] is the fourth relative trajectory point [p4_x - drone_x, p4_y - drone_y, p4_z - drone_z]
            - obs[24:27] is the fifth relative trajectory point [p5_x - drone_x, p5_y - drone_y, p5_z - drone_z]

- collision_flag : bool

Task objective:
- The drone should continuously follow the trajectory smoothly.
- Reward should encourage staying close to the entire future trajectory while progressing forward along the trajectory direction.
- The reward should behave like trajectory tracking rather than sparse waypoint reaching.

Reward design requirements:
- Keep the reward simple and stable.
- Use dense reward shaping.
- Use weighted distances to all future trajectory points, with larger weights for nearer points.
- Use smooth exponential distance shaping instead of sparse waypoint bonuses.
- Encourage forward motion along the trajectory direction using velocity alignment with the local trajectory tangent.
- Avoid hard switching between active waypoints.
- Penalize collision strongly.
- Avoid unrelated reward terms.

Implementation requirements:
- Output only valid Python code.
- Write exactly this function:

def compute_reward(obs, collision_flag):
    ...
    return reward
"""`,
    refinedPrompt: `"""
Generate a Python reward function for an RL agent whose goal is to smoothly follow a trajectory
defined by five ordered future waypoints.

Assume the simulator provides:
- obs : np.array
        Shape (27,) for single drone:
            - obs[0:3] is the drone position [x, y, z]
            - obs[3:6] is the drone orientation [roll, pitch, yaw]
            - obs[6:9] is the drone linear velocity [vx, vy, vz]
            - obs[9:12] is the drone angular velocity [wx, wy, wz]
            - obs[12:15] is the first relative trajectory point [p1_x - drone_x, p1_y - drone_y, p1_z - drone_z]
            - obs[15:18] is the second relative trajectory point [p2_x - drone_x, p2_y - drone_y, p2_z - drone_z]
            - obs[18:21] is the third relative trajectory point [p3_x - drone_x, p3_y - drone_y, p3_z - drone_z]
            - obs[21:24] is the fourth relative trajectory point [p4_x - drone_x, p4_y - drone_y, p4_z - drone_z]
            - obs[24:27] is the fifth relative trajectory point [p5_x - drone_x, p5_y - drone_y, p5_z - drone_z]

- collision_flag : bool

Task objective:
- The drone should continuously follow the trajectory smoothly.
- Reward should encourage staying close to the entire future trajectory while progressing forward along the trajectory direction.
- The reward should behave like trajectory tracking rather than sparse waypoint reaching.

Reward design requirements:
- Keep the reward simple and stable.
- Use dense reward shaping.
- Use weighted distances to all future trajectory points, with larger weights for nearer points.
- Use smooth exponential distance shaping instead of sparse waypoint bonuses.
- Encourage forward motion along the trajectory direction using velocity alignment with the local trajectory tangent.
- Avoid hard switching between active waypoints.
- Penalize collision strongly.
- Avoid unrelated reward terms.

Implementation requirements:
- Output only valid Python code.
- Write exactly this function:

def compute_reward(obs, collision_flag):
    ...
    return reward
"""`,
    rewardCode: `import numpy as np

def compute_reward(obs, collision_flag):
    obs = np.asarray(obs, dtype=np.float32)

    vel = obs[6:9]
    rel_pts = obs[12:27].reshape(5, 3)

    if collision_flag:
        return -10.0

    dist_weights = np.array([0.6, 0.6, 0.8, 0.9, 1.4], dtype=np.float32)
    dists = np.linalg.norm(rel_pts, axis=1)
    track_terms = np.exp(-1.5 * dists)
    tracking_reward = np.sum(dist_weights * track_terms) / np.sum(dist_weights)

    tangent_weights = np.array([1.0, 0.7, 0.4, 0.2], dtype=np.float32)
    segs = rel_pts[1:] - rel_pts[:-1]
    seg_norms = np.linalg.norm(segs, axis=1, keepdims=True)
    seg_dirs = segs / np.clip(seg_norms, 1e-6, None)
    local_tangent = np.sum(tangent_weights[:, None] * seg_dirs, axis=0)

    tangent_norm = np.linalg.norm(local_tangent)
    speed = np.linalg.norm(vel)

    if tangent_norm > 1e-6 and speed > 1e-6:
        tangent_dir = local_tangent / tangent_norm
        vel_dir = vel / speed
        alignment = np.dot(vel_dir, tangent_dir)
        forward_reward = 0.5 * max(0.0, alignment) * (1.0 - np.exp(-0.5 * speed))
    else:
        forward_reward = 0.0

    reward = 1.0 * tracking_reward + forward_reward
    return float(reward)`
  },

  gate: {
    title: "Gate Traversal",
    text: "Approach the gate center and pass through the opening while remaining stable and collision-free.",
    bullets: [
      "Primary objective: precise traversal through gate center.",
      "Failure condition: collision or missing the gate.",
      "Best for showing concentrated reward near a sparse spatial target."
    ],
    ssr: "100%",
    rsr: "100%",
    s2r: "100%",
    plot: "assets/pass_gate.png",
    plotAlt: "Gate traversal real-world plot",
    plotCaption: "Real-world gate-traversal rollout colored by velocity magnitude.",
    gif: "videos/gate_traversal.gif",
    gifAlt: "Gate traversal reward evolution",
    gifCaption: "Reward becomes sharply concentrated near the gate center.",
    taskMediaType: "image",
    taskMediaSrc: "assets/task_input_gate.jpg",
    taskMediaAlt: "Gate traversal task input image",
    taskMediaCaption: "Scene image showing the gate used for reward generation.",
    userPrompt: `"""
Generate a Python reward function for an RL agent whose goal is to fly towards the gate's center shown in the scene.

Assume the simulator provides:
- obs : np.array
        Shape (16,) for single drone:
        [pos(:3), rpy(3:6), vel(6:9), ang_vel(9:12), gate(12:15) are x-coordinate of gate's center, y-coordinate of gate's center, z-coordinate of gate's center, and gate(15) are => gate_orientation]
- collision_flag : bool

Requirements:
- Design a reward that moves towards the gate's center.
- Reward should be very high at gate's center.
- Do not add unnecessary components.
- Output only valid Python code.
- Write exactly this function:

def compute_reward(obs, collision_flag):
    ...
    return reward
"""`,
    refinedPrompt: `"""
Generate a Python reward function for an RL agent whose goal is to fly towards the gate's center shown in the scene.

Assume the simulator provides:
- obs : np.array
        Shape (16,) for single drone:
        [pos(:3), rpy(3:6), vel(6:9), ang_vel(9:12), gate(12:15) are x-coordinate of gate's center, y-coordinate of gate's center, z-coordinate of gate's center, and gate(15) are => gate_orientation]
- collision_flag : bool

Requirements:
- Design a reward that moves towards the gate's center.
- Reward should be very high at gate's center.
- Do not add unnecessary components.
- Output only valid Python code.
- Write exactly this function:

def compute_reward(obs, collision_flag):
    ...
    return reward
"""`,
    rewardCode: `def compute_reward(obs, collision_flag):
    import numpy as np

    pos = obs[:3]
    gate_center = obs[12:15]

    dist = np.linalg.norm(pos - gate_center)

    reward = 0.0
    reward += 2.0 * np.exp(-1.5 * dist)
    reward += 6.0 * np.exp(-12.0 * dist)

    if dist < 0.20:
        reward += 3.0
    if dist < 0.10:
        reward += 6.0
    if dist < 0.05:
        reward += 12.0

    if collision_flag:
        reward -= 10.0

    return float(reward)`
  },

  obstacle: {
    title: "Obstacle Avoidance and Landing",
    text: "Avoid three cylindrical obstacles and safely land on the target point.",
    bullets: [
      "Primary objective: obstacle clearance with successful landing.",
      "Failure condition: collision or unsafe arrival.",
      "Best for showing safety-aware dense reward refinement."
    ],
    ssr: "96%",
    rsr: "82%",
    s2r: "85%",
    plot: "assets/obstacle_avoid.png",
    plotAlt: "Obstacle avoidance and landing real-world plot",
    plotCaption: "Real-world obstacle-avoidance and landing rollout colored by velocity magnitude.",
    gif: "videos/avoid_obs_and_land.gif",
    gifAlt: "Obstacle avoidance and landing reward evolution",
    gifCaption: "Reward balances progress to the landing pad with obstacle-clearance penalties.",
    taskMediaType: "image",
    taskMediaSrc: "assets/task_input_obstacle.jpg",
    taskMediaAlt: "Obstacle avoidance and landing task input image",
    taskMediaCaption: "Scene image with obstacles and landing pad used for reward generation.",
    userPrompt: `"""
Generate a Python reward function for an RL agent whose goal is to avoid three cylindrical obstacles and land on the target point.

Assume the simulator provides:
- obs : np.array
        Shape (21,) for single drone:
        [drone_state_features..., landing_pad(12:15), obstacle_1_xy(15:17), obstacle_2_xy(17:19), obstacle_3_xy(19:21)]
        where:
            - obs[0:3] is the drone position [x, y, z]
            - obs[12:15] is the landing pad position [x, y, z]
            - obs[15:17], obs[17:19], and obs[19:21] are the x,y centers of the three obstacles
- collision_flag : bool

Task objective:
- The drone should safely avoid all three cylindrical obstacles and reach the landing pad target point.
- Success means reaching the landing target region without collision and without violating clearance around any obstacle.

Reward design requirements:
- Keep the reward simple and stable.
- Use progress toward the landing pad as the main signal.
- Encourage maintaining safe clearance from the nearest obstacle while still making progress to the target.
- Use the minimum clearance over all obstacles when applying obstacle penalties.
- Reward precise arrival at the landing target.
- Penalize collision.
- Do not use speed as a success metric or add unrelated shaping terms.

Implementation requirements:
- Output only valid Python code.
- Write exactly this function:

def compute_reward(obs, collision_flag):
    ...
    return reward
"""`,
    refinedPrompt: `"""
Generate a Python reward function for an RL agent whose goal is to avoid three cylindrical obstacles and land on the target point.

Assume the simulator provides:
- obs : np.array
        Shape (21,) for single drone:
        [drone_state_features..., landing_pad(12:15), obstacle_1_xy(15:17), obstacle_2_xy(17:19), obstacle_3_xy(19:21)]
        where:
            - obs[0:3] is the drone position [x, y, z]
            - obs[12:15] is the landing pad position [x, y, z]
            - obs[15:17], obs[17:19], and obs[19:21] are the x,y centers of the three obstacles
- collision_flag : bool

Task objective:
- The drone should safely avoid all three cylindrical obstacles and reach the landing pad target point.
- Success means reaching the landing target region without collision and without violating clearance around any obstacle.

Reward design requirements:
- Keep the reward simple and stable.
- Use progress toward the landing pad as the main signal.
- Encourage maintaining safe clearance from the nearest obstacle while still making progress to the target.
- Use the minimum clearance over all obstacles when applying obstacle penalties.
- Reward precise arrival at the landing target.
- Penalize collision.
- Do not use speed as a success metric or add unrelated shaping terms.

Implementation requirements:
- Output only valid Python code.
- Write exactly this function:

def compute_reward(obs, collision_flag):
    ...
    return reward
"""`,
    rewardCode: `import numpy as np

def compute_reward(obs, collision_flag):
    drone_pos = obs[0:3]
    target_pos = obs[12:15]

    obstacle_1 = obs[15:17]
    obstacle_2 = obs[17:19]
    obstacle_3 = obs[19:21]
    drone_xy = drone_pos[0:2]

    target_dist = np.linalg.norm(drone_pos - target_pos)

    d1 = np.linalg.norm(drone_xy - obstacle_1)
    d2 = np.linalg.norm(drone_xy - obstacle_2)
    d3 = np.linalg.norm(drone_xy - obstacle_3)
    min_clearance = min(d1, d2, d3)

    reward = -target_dist

    safe_clearance = 0.6
    hard_clearance = 0.3

    if min_clearance < safe_clearance:
        reward -= 2.0 * (safe_clearance - min_clearance)

    if min_clearance < hard_clearance:
        reward -= 5.0 * (hard_clearance - min_clearance)

    if target_dist < 0.15 and min_clearance >= safe_clearance and not collision_flag:
        reward += 10.0
    elif target_dist < 0.30 and min_clearance >= safe_clearance and not collision_flag:
        reward += 3.0

    if collision_flag:
        reward -= 20.0

    return reward`
  },

  barrier: {
    title: "Wall Barrier Crossing and Land",
    text: "Cross over the wall barrier and then land precisely on the yellow landing pad.",
    bullets: [
      "Primary objective: valid barrier crossing followed by precise landing.",
      "Failure condition: collision or invalid approach around the wall.",
      "Best for showing structured multi-stage reward refinement."
    ],
    ssr: "95%",
    rsr: "85%",
    s2r: "89%",
    plot: "assets/barrier_land.png",
    plotAlt: "Barrier crossing and landing real-world plot",
    plotCaption: "Real-world barrier-crossing and landing rollout colored by velocity magnitude.",
    gif: "videos/barrier_cross_and_land.gif",
    gifAlt: "Barrier crossing and landing reward evolution",
    gifCaption: "Reward encourages barrier crossing first, then landing-pad approach.",
    taskMediaType: "image",
    taskMediaSrc: "assets/task_input_barrier.jpg",
    taskMediaAlt: "Barrier crossing and landing task input image",
    taskMediaCaption: "Scene image with the wall barrier and landing pad used for reward generation.",
    userPrompt: `"""
Generate a Python reward function for an RL agent whose goal is to cross over the wall barrier shown in the scene and then land on the yellow landing pad.

Assume the simulator provides:
- obs : np.array
        Shape (18,) for single drone:
            [drone_state_features..., landing_pad(12:15), obstacle_center(15:17), obstacle_height(17)]
        where:
            - obs[0:3] is the drone position [x, y, z]
            - obs[12:15] is the landing pad position [x, y, z]
            - obs[15:17] is the wall center position [x, y]
            - obs[17] is the wall height
- collision_flag : bool

Task objective:
- The drone should cross the wall barrier and then reach the landing pad target point.
- The barrier blocks direct planar motion, so the reward should encourage valid barrier-crossing behavior rather than sideways avoidance.

Reward design requirements:
- Keep the reward simple and stable.
- Use progress toward the landing pad as a main signal.
- Reward successful post-cross approach and precise arrival at the landing target.
- Penalize collision.
- Do not add unrelated shaping terms.

Implementation requirements:
- Output only valid Python code.
- Write exactly this function:

def compute_reward(obs, collision_flag):
    ...
    return reward
"""`,
    refinedPrompt: `"""
Generate a Python reward function for an RL agent whose goal is to cross over the wall barrier shown in the scene and then land on the yellow landing pad.

Assume the simulator provides:
- obs : np.array
        Shape (18,) for single drone:
            [drone_state_features..., landing_pad(12:15), obstacle_center(15:17), obstacle_height(17)]
        where:
            - obs[0:3] is the drone position [x, y, z]
            - obs[12:15] is the landing pad position [x, y, z]
            - obs[15:17] is the wall center position [x, y]
            - obs[17] is the wall height
- collision_flag : bool

Task objective:
- The drone should cross the wall barrier and then reach the landing pad target point.
- The barrier blocks direct planar motion, so the reward should encourage valid barrier-crossing behavior rather than sideways avoidance.

Reward design requirements:
- Keep the reward simple and stable.
- Use progress toward the landing pad as a main signal.
- Reward successful post-cross approach and precise arrival at the landing target.
- Penalize collision.
- Do not add unrelated shaping terms.

Implementation requirements:
- Output only valid Python code.
- Write exactly this function:

def compute_reward(obs, collision_flag):
    ...
    return reward
"""`,
    rewardCode: `def compute_reward(obs, collision_flag):
    reward = 0.0

    drone_pos = obs[0:3]
    drone_xy = drone_pos[0:2]
    drone_z = drone_pos[2]

    pad_pos = obs[12:15]
    pad_xy = pad_pos[0:2]

    wall_center_xy = obs[15:17]
    wall_height = float(obs[17])

    wall_to_pad = pad_xy - wall_center_xy
    wall_to_pad_norm = np.linalg.norm(wall_to_pad)

    if wall_to_pad_norm < 1e-6:
        wall_normal = np.array([1.0, 0.0], dtype=float)
    else:
        wall_normal = wall_to_pad / wall_to_pad_norm

    rel_xy = drone_xy - wall_center_xy
    signed_progress = float(np.dot(rel_xy, wall_normal))
    on_pad_side = signed_progress > 0.2

    lateral_vec = rel_xy - signed_progress * wall_normal
    lateral_dist = float(np.linalg.norm(lateral_vec))

    if not on_pad_side:
        reward += 1.5 * signed_progress

        near_wall_start_side = (-1.5 < signed_progress < 0.0) and (lateral_dist < 1.0)
        if near_wall_start_side:
            clear_margin = 0.2
            target_z = wall_height + clear_margin
            height_term = np.clip((drone_z - (target_z - 0.5)) / 0.5, 0.0, 1.0)
            reward += 0.8 * height_term

        crossed_margin_bonus = np.clip(signed_progress - 0.2, 0.0, 0.6) / 0.6
        reward += 4.0 * crossed_margin_bonus
    else:
        reward += 4.0 + 1.0 * np.clip(signed_progress, 0.0, 2.0)

        dist_to_pad = float(np.linalg.norm(drone_pos - pad_pos))
        reward += 2.5 / (1.0 + dist_to_pad)

        if dist_to_pad < 0.5:
            reward += 8.0
        elif dist_to_pad < 1.0:
            reward += 3.0

    if collision_flag:
        reward -= 10.0

    return float(reward)`
  },

  circular: {
    title: "Circular Motion Generation",
    text: "Generate a stable circular motion with 1 meter radius in the xy plane at a height of 1 meter.",
    bullets: [
      "Primary objective: learn orbit-like motion with stable altitude.",
      "Failure condition: unstable drift or collision.",
      "Best for showing behavior-level motion reward shaping."
    ],
    ssr: "98%",
    rsr: "98%",
    s2r: "100%",
    plot: "assets/motion_gen.png",
    plotAlt: "Circular motion generation real-world plot",
    plotCaption: "Real-world circular-motion rollout colored by velocity magnitude.",
    gif: "videos/circular_motion_gen.gif",
    gifAlt: "Circular motion reward evolution",
    gifCaption: "Reward forms an orbit-aware field centered on the desired circular motion.",
    taskMediaType: "video",
    taskMediaSrc: "videos/motion_gen.mp4",
    taskMediaAlt: "Circular motion task input video",
    taskMediaCaption: "Motion clip provided as visual context for learning circular behavior.",
    userPrompt: `"""
Generate a Python reward function for an RL agent whose goal is to learn a circular motion behavior as seen in the video.

Assume the simulator provides:
- obs : np.array
        Shape (27,) for single drone:
            - obs[0:3] is the drone position [x, y, z]
            - obs[3:6] is the drone orientation [roll, pitch, yaw]
            - obs[6:9] is the drone linear velocity [vx, vy, vz]
            - obs[9:12] is the drone angular velocity [wx, wy, wz]

- collision_flag : bool

Task objective:
- The drone should create a 1 meter radius circular motion in xy plane at height of 1 meter.
- Reward should encourage learning this specific motion without diverging.

Reward design requirements:
- Keep the reward simple and stable.
- Use dense reward shaping.
- Penalize collision strongly.
- Avoid unrelated reward terms.

Implementation requirements:
- Output only valid Python code.
- Write exactly this function:

def compute_reward(obs, collision_flag):
    ...
    return reward
"""`,
    refinedPrompt: `"""
Generate a Python reward function for an RL agent whose goal is to learn a circular motion behavior as seen in the video.

Assume the simulator provides:
- obs : np.array
        Shape (27,) for single drone:
            - obs[0:3] is the drone position [x, y, z]
            - obs[3:6] is the drone orientation [roll, pitch, yaw]
            - obs[6:9] is the drone linear velocity [vx, vy, vz]
            - obs[9:12] is the drone angular velocity [wx, wy, wz]

- collision_flag : bool

Task objective:
- The drone should create a 1 meter radius circular motion in xy plane at height of 1 meter.
- Reward should encourage learning this specific motion without diverging.

Reward design requirements:
- Keep the reward simple and stable.
- Use dense reward shaping.
- Penalize collision strongly.
- Avoid unrelated reward terms.

Implementation requirements:
- Output only valid Python code.
- Write exactly this function:

def compute_reward(obs, collision_flag):
    ...
    return reward
"""`,
    rewardCode: `import numpy as np

def compute_reward(obs, collision_flag):
    x, y, z = obs[0:3]
    roll, pitch, yaw = obs[3:6]
    vx, vy, vz = obs[6:9]
    wx, wy, wz = obs[9:12]

    target_altitude = 1.0
    target_radius = 1.0
    desired_speed = 0.4
    radius = np.sqrt(x * x + y * y)
    tangential_velocity = (-y * vx + x * vy) / (radius + 1e-6)

    reward = 0.0
    reward -= 2.0 * abs(radius - target_radius)
    reward -= 2.0 * abs(z - target_altitude)
    reward -= 1.0 * abs(tangential_velocity - desired_speed)
    reward -= 0.5 * abs(vz)

    if collision_flag:
        reward -= 20.0

    return reward`
  }
};

function updateScenario(scenarioKey) {
  const s = scenarioData[scenarioKey];
  if (!s) return;

  document.getElementById("scenarioTitle").textContent = s.title;
  document.getElementById("scenarioText").textContent = s.text;
  document.getElementById("ssrBox").textContent = s.ssr;
  document.getElementById("rsrBox").textContent = s.rsr;
  document.getElementById("s2rBox").textContent = s.s2r;

  const bullets = document.getElementById("scenarioBullets");
  bullets.innerHTML = "";
  s.bullets.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    bullets.appendChild(li);
  });

  const plot = document.getElementById("scenarioPlot");
  plot.src = s.plot;
  plot.alt = s.plotAlt;
  document.getElementById("scenarioPlotCaption").textContent = s.plotCaption;

  const gif = document.getElementById("scenarioGif");
  gif.src = s.gif;
  gif.alt = s.gifAlt;
  document.getElementById("scenarioGifCaption").textContent = s.gifCaption;

  const taskImage = document.getElementById("taskMediaImage");
  const taskVideo = document.getElementById("taskMediaVideo");

  if (s.taskMediaType === "video") {
    taskImage.style.display = "none";
    taskVideo.style.display = "block";
    taskVideo.src = s.taskMediaSrc;
    taskVideo.load();
  } else {
    taskVideo.pause();
    taskVideo.style.display = "none";
    taskVideo.removeAttribute("src");
    taskImage.style.display = "block";
    taskImage.src = s.taskMediaSrc;
    taskImage.alt = s.taskMediaAlt;
  }

  document.getElementById("taskMediaCaption").textContent = s.taskMediaCaption;
  document.getElementById("scenarioUserPrompt").textContent = s.userPrompt;
  document.getElementById("scenarioRefinedPrompt").textContent = s.refinedPrompt;
  document.getElementById("scenarioRewardCode").textContent = s.rewardCode;

  document.querySelectorAll(".scenario-tabs .tab").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.scenario === scenarioKey);
  });
}

document.querySelectorAll(".scenario-tabs .tab").forEach(button => {
  button.addEventListener("click", () => {
    updateScenario(button.dataset.scenario);
  });
});

updateScenario("trajectory");
</script>

document.querySelectorAll('.tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const data = scenarioData[tab.dataset.scenario];
    document.getElementById('scenarioTitle').textContent = data.title;
    document.getElementById('scenarioText').textContent = data.text;
    document.getElementById('ssrBox').textContent = data.ssr;
    document.getElementById('rsrBox').textContent = data.rsr;
    document.getElementById('s2rBox').textContent = data.s2r;
    document.getElementById('scenarioBullets').innerHTML = data.bullets.map(item => `<li>${item}</li>`).join('');
  });
});

document.querySelectorAll('.table-search').forEach(input => {
  input.addEventListener('input', () => {
    const table = document.getElementById(input.dataset.table);
    const query = input.value.toLowerCase();
    table.querySelectorAll('tbody tr').forEach(row => {
      row.style.display = row.textContent.toLowerCase().includes(query) ? '' : 'none';
    });
  });
});
