import React from 'react';

export function Icon({
  name,
  size = 26,
  color = '#333',
}: {
  name: string;
  size?: number;
  color?: string;
}) {
  const style = {
    fontSize: size,
    color: color,
  };

  switch (name) {
    case 'woman':
      return <span className="material-icons" style={style}>face_retouching_natural</span>;

    case 'man':
      return <span className="material-icons" style={style}>face</span>;

    case 'barber':
      return <span className="material-icons" style={style}>content_cut</span>;

    case 'beauty':
      return <span className="material-icons" style={style}>spa</span>;

    case 'home':
      return <span className="material-icons" style={style}>home</span>;

    case 'search':
      return <span className="material-icons" style={style}>search</span>;

    case 'calendar':
      return <span className="material-icons" style={style}>event</span>;

    case 'user':
      return <span className="material-icons" style={style}>person</span>;

    case 'star':
      return <span className="material-icons" style={style}>star</span>;
      case 'sparkle':
  return <span className="material-icons" style={style}>auto_awesome</span>;

    default:
      return null;
  }
}