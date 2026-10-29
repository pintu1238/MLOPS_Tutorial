(function () {
  var TITLE_LABELS = ['Model Name', 'Item Type Name', 'Toy Vehicle Form', 'Subject Character'];

  var SEED_TRAITS = {
    1: { colour: 'Red / Blue', theme: 'Drift Car, Four Wheel Drive, Racing' },
    2: { colour: 'Green', theme: 'Rock Crawler, Off-Road, 4WD' },
    3: { colour: 'Blue', theme: 'Hobby RC, Street, Racing' },
    4: { colour: 'Yellow', theme: 'Construction, Excavator, Work Vehicle' },
    5: { colour: 'Multi-colour', theme: 'Monster Truck, Stunt, Off-Road' },
    6: { colour: 'Red', theme: 'Emergency, Fire Truck, Rescue' },
    7: { colour: 'Yellow / Grey', theme: 'Construction, Wheel Loader' },
    8: { colour: 'Grey / Orange', theme: 'Rock Crawler, Climbing, 4WD' }
  };

  var ARRIVAL_TRAITS = {
    1: { colour: 'Grey / Navy', theme: 'RC Ship, Battleship, Water' },
    2: { colour: 'Red / White', theme: 'RC Boat, Speedboat, Water' },
    3: { colour: 'White / Blue', theme: 'RC Airplane, Trainer, Air' },
    4: { colour: 'Grey', theme: 'RC Jet, Fighter, Air' },
    5: { colour: 'Yellow / Black', theme: 'RC Helicopter, Gyro, Air' },
    6: { colour: 'Yellow / Black', theme: 'RC Submarine, Pool, Water' },
    7: { colour: 'White', theme: 'RC Yacht, Cruise, Water' },
    8: { colour: 'White / Orange', theme: 'RC Seaplane, Water takeoff' },
    9: { colour: 'Olive / Black', theme: 'RC Helicopter, Military, Air' },
    10: { colour: 'Grey / Green', theme: 'RC Cargo Plane, Air' },
    11: { colour: 'White', theme: 'RC Sailboat, Pond, Water' },
    12: { colour: 'Black / White', theme: 'RC Drone, Quadcopter, Air' }
  };

  var SEED_INBOX = {
    1: ['RC Drift Car', 'Remote', 'Charging Cable', 'Battery', 'Extra 4 drift tyres & 4 cones'],
    2: ['RC Rock Crawler', 'Remote', 'Charging Cable', 'Battery', 'Spare wheel set'],
    3: ['RC Hobby Car', 'Remote', 'Charging Cable', 'Battery', 'Body clips & tools'],
    4: ['RC Excavator', 'Remote', 'USB Charging Cable', 'Battery', 'Demo obstacles'],
    5: ['RC Monster Truck', 'Remote', 'Charging Cable', 'Battery', 'Stunt ramps (where included)'],
    6: ['RC Fire Truck', 'Remote', 'Charging Cable', 'Battery', 'Light & sound module'],
    7: ['RC Wheel Loader', 'Remote', 'Charging Cable', 'Battery', 'Bucket attachment'],
    8: ['RC Rock Crawler', 'Remote', 'Charging Cable', 'Battery', 'Climbing tyres']
  };

  var ARRIVAL_INBOX = {
    1: ['RC Battleship', 'Remote', 'Charging Cable', 'Battery', 'User manual'],
    2: ['RC Speedboat', 'Remote', 'USB Charging Cable', 'Battery', 'User manual'],
    3: ['RC Airplane', 'Remote', 'Charging Cable', 'Battery', 'Spare propeller'],
    4: ['RC Fighter Jet', 'Remote', 'Charging Cable', 'Battery', 'User manual'],
    5: ['RC Helicopter', 'Remote', 'USB Charging Cable', 'Battery', 'Spare blades'],
    6: ['RC Submarine', 'Remote', 'Charging Cable', 'Battery', 'User manual'],
    7: ['RC Yacht', 'Remote', 'USB Charging Cable', 'Battery', 'User manual'],
    8: ['RC Seaplane', 'Remote', 'Charging Cable', 'Battery', 'User manual'],
    9: ['RC Attack Helicopter', 'Remote', 'Charging Cable', 'Battery', 'Spare blades'],
    10: ['RC Cargo Plane', 'Remote', 'USB Charging Cable', 'Battery', 'User manual'],
    11: ['RC Sailboat', 'Remote', 'USB Charging Cable', 'Battery', 'User manual'],
    12: ['RC Drone', 'Remote / app guide', 'USB Charging Cable', 'Battery', 'Spare props']
  };

  function readPreview() {
    var params = new URLSearchParams(window.location.search);
    var title = params.get('tc_title') || '';
    var seed = params.get('tc_seed') || '';
    var img = params.get('tc_img') || '';
    var subtitle = '';
    try {
      var stored = JSON.parse(sessionStorage.getItem('tcMpPdpPreview') || 'null');
      if (stored) {
        if (!title && stored.title) title = stored.title;
        if (!seed && stored.seed) seed = String(stored.seed);
        if (!img && stored.img) img = stored.img;
        if (stored.subtitle) subtitle = stored.subtitle;
      }
    } catch (e) {
      /* ignore */
    }
    var arrival = /tc-mp-arrival/.test(img);
    if (!seed && img) {
      var m = String(img).match(/tc-mp-(?:shop|drift|arrival)-(\d{2})/);
      if (m) seed = String(parseInt(m[1], 10));
    }
    if (!title && !seed && !subtitle) return null;
    return { title: title, seed: parseInt(seed, 10) || 0, subtitle: subtitle, arrival: arrival };
  }

  function setValForLabel(root, label, value) {
    if (!value) return;
    root.querySelectorAll('[data-ft-spec-label="' + label + '"]').forEach(function (el) {
      el.textContent = value;
    });
  }

  function inboxLinesForPreview(preview) {
    var lines = preview.arrival ? ARRIVAL_INBOX[preview.seed] : SEED_INBOX[preview.seed];
    if (!lines && preview.seed > 0) {
      lines = [preview.arrival ? 'RC model' : 'RC Car', 'Remote', 'Charging Cable', 'Battery', 'User manual'];
    }
    if (!lines) return null;
    lines = lines.slice();
    if (preview.title) lines[0] = preview.title;
    return lines;
  }

  function applyCatalogInboxPreview() {
    var preview = readPreview();
    if (!preview) return;
    var list = document.querySelector('[data-ft-inbox-list]');
    if (!list) return;
    var lines = inboxLinesForPreview(preview);
    if (!lines || !lines.length) return;
    list.innerHTML = '';
    lines.forEach(function (text) {
      var li = document.createElement('li');
      li.textContent = text;
      list.appendChild(li);
    });
  }

  function applyCatalogSpecPreview() {
    var preview = readPreview();
    if (!preview) return;

    var root = document.querySelector('.ft-specs');
    if (!root) return;

    if (preview.title) {
      TITLE_LABELS.forEach(function (label) {
        setValForLabel(root, label, preview.title);
      });
    }

    var traits = preview.arrival ? ARRIVAL_TRAITS[preview.seed] : SEED_TRAITS[preview.seed];
    if (traits) {
      setValForLabel(root, 'Colour', traits.colour);
      setValForLabel(root, 'Theme', traits.theme);
    } else if (preview.seed > 0) {
      setValForLabel(root, 'Colour', 'Assorted');
      setValForLabel(root, 'Theme', preview.arrival ? 'Remote Control, RC Hobby' : 'Remote Control, RC Car, Racing');
    }

    if (preview.subtitle) {
      var scaleMatch = preview.subtitle.match(/1:\d+/i);
      if (scaleMatch) {
        setValForLabel(root, 'Scale', scaleMatch[0]);
        setValForLabel(root, 'Size', scaleMatch[0]);
      }
    }
  }

  function applyCatalogPreview() {
    applyCatalogSpecPreview();
    applyCatalogInboxPreview();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyCatalogPreview);
  } else {
    applyCatalogPreview();
  }
})();
