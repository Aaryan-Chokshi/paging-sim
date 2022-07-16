let k = 4096

var page_ref = []
var pri_order = []
var pf_referred = 0

function initial_insert()
{
    page_ref = document.getElementById('input_pf_order').value.split(',')
    for (let i=0;i<page_ref.length;i++)
        pri_order.push(page_ref[i])

    document.getElementById("0").innerHTML = page_ref[0]
    document.getElementById("1").innerHTML = page_ref[1]
    document.getElementById("2").innerHTML = page_ref[2]
    document.getElementById("3").innerHTML = page_ref[3]

    document.getElementById("4").innerHTML = 'x'
    document.getElementById("5").innerHTML = 'x'
    document.getElementById("6").innerHTML = 'x'
    document.getElementById("7").innerHTML = 'x'

    for(let i=1;i<=4;i++)
    {
        page_ref.push('x')
    }
}

function performaddrconversion()
{
    var page_inc = document.getElementById('page_req').value
    var rem = Math.floor(page_inc / k)
    var pf_referred = page_ref[rem]


    if (rem >= page_ref.length) // Address is out of bounds
        document.getElementById('page_status').innerHTML = "NOT FOUND"
        
    else{
        pf_referred = page_ref[rem]

        if(pf_referred == 'x'){ // Page is not present in the given address block
            alert("PAGE FAULT! Accessing FIFO Page replacement algorithm...")
            let idx = execute_pra(pri_order,rem,pf_referred)
            document.getElementById(idx).innerHTML = 'x'
            document.getElementById(rem).innerHTML = pri_order[pri_order.length-1]

            performaddrconversion()
        }
        else{
            document.getElementById('pf-status').innerHTML = "Page frame status : "+"FOUND! Page frame refers to page no : "+pf_referred
            addr_bin = converttobinary(page_inc,16)
            document.getElementById('table-text').innerHTML = "Binary Array of the selected virtual address : "
            generate_table(addr_bin,'table')

            pf_referred = converttobinary(pf_referred,3)
            let phys_add = virttophy(addr_bin,pf_referred)
            document.getElementById('conv-vir-to-phy').innerHTML = "Conversion of virtual address to physical address"
            document.getElementById('conv-desc').innerHTML = "Physical Address (found by keeping the offset as it is and changing the first 4-bit page no. to a 3-bit corresponding page frame no) : "
            generate_table(phys_add,'phy_addr')

            document.getElementById('phy_dec_add').innerHTML = parseInt(phys_add.join(''),2)
        }
    }
}

function virttophy(viradd,refpf)
{
    phyadd = viradd
    for(let i=0;i<4;i++)
        phyadd.shift()

    refpf.reverse()
    for(let i=0;i<3;i++)
        phyadd.unshift(refpf[i])
    
    return phyadd
}

function generate_table(val,loc)
{
    html_text = '<table><tr>'
    for(let i=0;i<val.length;i++)
        html_text += '<td>'+val[i]+'</td>' 
    html_text += '</tr></table>'

    document.getElementById(loc).style.border = "1px black"
    document.getElementById(loc).style.borderCollapse = "collapse"
    document.getElementById(loc).style.padding = "8px"
    document.getElementById(loc).innerHTML = html_text
}

function converttobinary(number,len)
{
    let val = Number(number).toString(2)
    const array = []
    if(val.length < len)
    {
        for (let i=0;i<len;i++)
        {
            if (i < len - val.length)
                array.push(0)
            else
                array.push(val[i - len + val.length])
        }
    }
    else if(val.length == len)
    {
        for (let i=0;i<val.length;i++)
            array.push(val[i])
    }
    return array
}

function execute_pra(pri_order,page_no,pf_referred)
{
    let val = 0

    let page_to_replace = pri_order.shift()
    for(let i = 0;i<page_ref.length;i++)
    {
        if(page_ref[i] == page_to_replace)
        {
            val = i
            page_ref[i] = 'x'
            break
        }
    }
    pri_order.push(page_to_replace)

    page_ref[page_no] = page_to_replace

    return val
}