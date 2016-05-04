3D Touch driven authentication training
===================


The following work has been done as part of the "Information Security Theory vs Reality" [1] course given at Tel Aviv University.

The application is used as a proof of concept for using new mobile and desktop features to design Rubber Hose Secured authentication.
The 3D Touch technology introduced by Apple in their iPhone 6S and iPhone 6S Plus is being studied as an additional dimension for implicit learning, the work is based on the following article:
[Neuroscience Meets Cryptography: Designing Crypto Primitives Secure Against Rubber Hose Attacks][2]


> **A Live example of the application:**
> 
<i class="icon-link"></i> [http://www.cs.tau.ac.il/~michaelroy/istvr/app/][3]

> - Should be used with iPhone 6S / iPhone 6S Plus for real evaluation.
> - On desktop & unsupported devices the force will be emulated by touch duration.

The system preprocesses multi touch gestures and force touch events data by relabeling each pressed point on the screen with the amount of force applied at that certain position in a certain time and this would be labeled as the “Trained Sequence”.
Each force touch pressure is defined by a circle of different size and color of which small and green is a “no force applied” point, yellow and medium sized is “medium amount of pressure applied” and red and large sized is “Maximum amount of pressure applied”

A subject should mimic the animation being presented on the screen, a scoring function is calculating the final score depends on the actual performance in comparison to the target positions and forces to be applied.

For any questions or comments please email me at [michaelroy@mail.tau.ac.il](mailto:michaelroy@mail.tau.ac.il)


[1]:http://www.cs.tau.ac.il/~tromer/istvr1516.html
[2]:https://www.usenix.org/system/files/conference/usenixsecurity12/sec12-final25.pdf
[3]:http://www.cs.tau.ac.il/~michaelroy/istvr/app/
