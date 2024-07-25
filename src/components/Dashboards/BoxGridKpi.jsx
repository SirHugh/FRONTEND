import { Box } from "@mui/system";
import Grid from "@mui/system/Unstable_Grid/Grid";

function BoxGridKpi({ title, value, icon }) {
  return (
    <div className="mt-3">
      <Box
        sx={{
          margin: 0,
          bgcolor: "white",
          borderRadius: 5,
          padding: 1,
        }}
      >
        <Grid
          container
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginX: 0,
            borderRadius: 2,
            padding: 0,
          }}
        >
          <div className="flex flex-row items-center">
            <div className="flex flex-col items-center justify-center">
              {icon}
            </div>
            <div className="pl-2 text-slate-500 text-xl">
              <div>
                <p className="">{title}</p>
              </div>
              <div className="flex justify-center">
                <p className="text-3xl font-bold">{value}</p>
              </div>
            </div>
          </div>
        </Grid>
      </Box>
    </div>
  );
}

export default BoxGridKpi;
