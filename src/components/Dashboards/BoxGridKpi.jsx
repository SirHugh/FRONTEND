import { Box } from "@mui/system";
import Grid from "@mui/system/Unstable_Grid/Grid";

function BoxGridKpi({ title, value, icon }) {
  return (
    <div className="mt-3">
      <Box
        sx={{
          width: 145, // Tamaño fijo para mantener la uniformidad
          height: 145, // Tamaño fijo para mantener la uniformidad
          bgcolor: "white",
          borderRadius: 5,
          padding: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Grid
          container
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            borderRadius: 2,
            padding: 0,
          }}
        >
          <div className="flex flex-col items-center justify-center">
            <div className="mb-2">{icon}</div>
            <div className="text-slate-500 text">
              <p className="">{title}</p>
              <p className="text-3xl font-bold">{value}</p>
            </div>
          </div>
        </Grid>
      </Box>
    </div>
  );
}

export default BoxGridKpi;
