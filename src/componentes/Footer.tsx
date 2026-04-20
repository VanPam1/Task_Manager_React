type Props = {
  total: number;
};

function Footer({ total }: Props) {
  return <p className="footer">Total tareas: {total}</p>;
}

export default Footer;