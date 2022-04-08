<!-- script -->
<script>
    const spanSlow = document.querySelectorAll(".spanSlow");
    const spanFast = document.querySelectorAll(".spanFast");

    const mouseMove = e => {
        let positionSlow = (e.pageX - (window.innerWidth/2)) * 0.1;
        let positionFast = (e.pageX - (window.innerWidth/2)) * 0.2;

        //spanSlow.style.transform = `translateX(${positionSlow}px)`;
        //spanFast.style.transform = `translateX(${positionFast}px)`;

        spanSlow.forEach(elem => {
            elem.style.transform = `translateX(${positionSlow}px)`;
        });
        spanFast.forEach(elem => {
            elem.style.transform = `translateX(${positionFast}px)`;
        });

        //출력용
        document.querySelector(".pageX").textContent = e.pageX;
        document.querySelector(".pageY").textContent = e.pageY;
        document.querySelector(".positionSlow").textContent = parseInt(positionSlow);
        document.querySelector(".positionFast").textContent = parseInt(positionFast);
    }

    window.addEventListener("mousemove", mouseMove);
</script>